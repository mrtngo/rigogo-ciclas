import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

// ─────────────────────────────────────────────────────────────
// createWompiCheckout — HTTPS Callable (authenticated)
// Called from the Pricing page. Creates a pending subscription
// record and returns a Wompi checkout URL.
// ─────────────────────────────────────────────────────────────
export const createWompiCheckout = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes iniciar sesión.');
  }

  const { plan } = data as { plan: string };
  const uid = context.auth.uid;

  if (!plan || !['sprinter', 'contrarreloj'].includes(plan)) {
    throw new functions.https.HttpsError('invalid-argument', 'plan debe ser sprinter o contrarreloj.');
  }

  const INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;
  const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
  const APP_URL = process.env.APP_URL ?? 'https://rigomarket.com';

  if (!INTEGRITY_SECRET || !WOMPI_PUBLIC_KEY) {
    throw new functions.https.HttpsError('internal', 'Configuración de Wompi incompleta.');
  }

  const amountCents = plan === 'sprinter' ? 2990000 : 6990000;
  const reference = `SUB-${uid}-${Date.now()}`;
  const currency = 'COP';

  // Integrity hash: SHA256(reference + amountInCents + "COP" + secret) — no separators
  const hashInput = `${reference}${amountCents}${currency}${INTEGRITY_SECRET}`;
  const integritySignature = crypto.createHash('sha256').update(hashInput, 'utf8').digest('hex');

  // Create a pending subscription record so the webhook can find it
  await db.collection('subscriptions').doc(uid).set(
    {
      plan,
      status: 'pending',
      wompiReference: reference,
      periodEnd: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

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
// Activates the subscription when payment is approved.
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

  // Look up the pending subscription by wompiReference
  const subQ = await db
    .collection('subscriptions')
    .where('wompiReference', '==', reference)
    .limit(1)
    .get();

  if (subQ.empty) {
    functions.logger.warn(`wompiWebhook: no subscription found for reference ${reference}`);
    res.status(200).send('OK');
    return;
  }

  const subDoc = subQ.docs[0];

  if (txStatus === 'APPROVED') {
    const now = admin.firestore.Timestamp.now();
    const plan = subDoc.data().plan as string;
    const durationDays = plan === 'contrarreloj' ? 60 : 30;
    const periodEnd = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + durationDays * 24 * 60 * 60 * 1000,
    );

    await subDoc.ref.update({
      status: 'active',
      periodEnd,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(`wompiWebhook: subscription ${subDoc.id} activated (plan: ${plan})`);
  } else if (['DECLINED', 'VOIDED', 'ERROR'].includes(txStatus)) {
    await subDoc.ref.update({
      status: 'failed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    functions.logger.info(`wompiWebhook: subscription ${subDoc.id} failed (tx: ${txStatus})`);
  }

  res.status(200).send('OK');
});
