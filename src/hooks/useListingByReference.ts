import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Listing } from '../types/product';

export function useListingByReference(reference: string | null) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reference) {
      setListing(null);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'listings'),
      where('wompiReference', '==', reference),
      limit(1),
    );
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        const d = snap.docs[0];
        setListing({ id: d.id, ...d.data() } as Listing);
      } else {
        setListing(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [reference]);

  return { listing, loading };
}
