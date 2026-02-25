import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import type { ListingPlan } from '../constants/plans';

export interface Subscription {
  plan: ListingPlan;
  status: 'pending' | 'active' | 'expired' | 'failed';
  periodEnd: Timestamp | null;
  wompiReference: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'subscriptions', user.uid), snap => {
      setSubscription(snap.exists() ? (snap.data() as Subscription) : null);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return { subscription, loading };
}
