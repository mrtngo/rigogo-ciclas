import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

// ─────────────────────────────────────────────────────────────
// createWompiCheckout — HTTPS Callable (authenticated)
// Called by the client after creating a draft listing.
// Returns { checkoutUrl, reference } for the Wompi redirect.
// ─────────────────────────────────────────────────────────────
export const createWompiCheckout = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes iniciar sesión.');
  }

  const { listingId, plan } = data as { listingId: string; plan: string };
  const uid = context.auth.uid;

  if (!listingId || !plan || !['sprinter', 'contrarreloj'].includes(plan)) {
    throw new functions.https.HttpsError('invalid-argument', 'listingId y plan (sprinter|contrarreloj) son requeridos.');
  }

  const listingRef = db.collection('listings').doc(listingId);
  const listingDoc = await listingRef.get();

  if (!listingDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Publicación no encontrada.');
  }

  const listing = listingDoc.data()!;
  if ((listing.seller as { uid: string }).uid !== uid) {
    throw new functions.https.HttpsError('permission-denied', 'No eres el dueño de esta publicación.');
  }

  const INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;
  const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
  const APP_URL = process.env.APP_URL ?? 'https://rigomarket.com';

  if (!INTEGRITY_SECRET || !WOMPI_PUBLIC_KEY) {
    throw new functions.https.HttpsError('internal', 'Configuración de Wompi incompleta.');
  }

  const amountCents = plan === 'sprinter' ? 2990000 : 6990000;
  const reference = `RIGO-${listingId}-${Date.now()}`;
  const currency = 'COP';

  // Integrity hash: SHA256(reference + amountInCents + "COP" + secret) — no separators
  const hashInput = `${reference}${amountCents}${currency}${INTEGRITY_SECRET}`;
  const integritySignature = crypto.createHash('sha256').update(hashInput, 'utf8').digest('hex');

  await listingRef.update({
    wompiReference: reference,
    status: 'draft',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const redirectUrl = `${APP_URL}/pago-resultado`;
  const checkoutUrl =
    `https://checkout.wompi.co/p/` +
    `?public-key=${encodeURIComponent(WOMPI_PUBLIC_KEY)}` +
    `&currency=${currency}` +
    `&amount-in-cents=${amountCents}` +
    `&reference=${encodeURIComponent(reference)}` +
    `&signature:integrity=${integritySignature}` +
    `&redirect-url=${encodeURIComponent(redirectUrl)}`;

  return { checkoutUrl, reference };
});

// ─────────────────────────────────────────────────────────────
// wompiWebhook — HTTPS onRequest (public endpoint)
// Registered in the Wompi dashboard as a webhook.
// Always returns 200 to prevent retries.
// ─────────────────────────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current != null && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export const wompiWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(200).send('OK');
    return;
  }

  const EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET;
  if (!EVENTS_SECRET) {
    functions.logger.error('wompiWebhook: WOMPI_EVENTS_SECRET not set');
    res.status(200).send('OK');
    return;
  }

  const body = req.body as Record<string, unknown>;

  // Verify Wompi event signature
  try {
    const sig = body.signature as { properties: string[]; checksum: string };
    const timestamp = body.timestamp as number;

    const propertyValues = sig.properties
      .map(prop => String(getNestedValue(body, prop) ?? ''))
      .join('');

    const hashInput = `${propertyValues}${timestamp}${EVENTS_SECRET}`;
    const expectedChecksum = crypto
      .createHash('sha256')
      .update(hashInput, 'utf8')
      .digest('hex');

    if (expectedChecksum !== sig.checksum) {
      functions.logger.warn('wompiWebhook: invalid signature — ignoring event');
      res.status(200).send('OK');
      return;
    }
  } catch (err) {
    functions.logger.error('wompiWebhook: signature verification error', err);
    res.status(200).send('OK');
    return;
  }

  const transaction = (body.data as Record<string, unknown>)
    ?.transaction as Record<string, unknown> | undefined;

  if (!transaction) {
    res.status(200).send('OK');
    return;
  }

  const reference = transaction.reference as string | undefined;
  const txStatus = transaction.status as string | undefined;

  if (!reference || !txStatus) {
    res.status(200).send('OK');
    return;
  }

  // Look up listing by wompiReference
  const q = await db
    .collection('listings')
    .where('wompiReference', '==', reference)
    .limit(1)
    .get();

  if (q.empty) {
    functions.logger.warn(`wompiWebhook: no listing found for reference ${reference}`);
    res.status(200).send('OK');
    return;
  }

  const listingDoc = q.docs[0];
  const listing = listingDoc.data();

  if (txStatus === 'APPROVED') {
    const now = admin.firestore.Timestamp.now();
    const durationDays = 60; // Sprinter and Contrarreloj both 60 days
    const periodEnd = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + durationDays * 24 * 60 * 60 * 1000,
    );

    await listingDoc.ref.update({
      status: 'active',
      planExpiresAt: periodEnd,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Upsert subscription record for the seller
    await db
      .collection('subscriptions')
      .doc(listing.seller.uid as string)
      .set(
        {
          plan: listing.plan,
          status: 'active',
          periodEnd,
          wompiReference: reference,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    functions.logger.info(`wompiWebhook: listing ${listingDoc.id} activated`);
  } else if (['DECLINED', 'VOIDED', 'ERROR'].includes(txStatus)) {
    await listingDoc.ref.update({
      status: 'rejected',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    functions.logger.info(`wompiWebhook: listing ${listingDoc.id} rejected (tx status: ${txStatus})`);
  }

  res.status(200).send('OK');
});
