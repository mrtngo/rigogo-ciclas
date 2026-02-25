import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export function useUserListings() {
  const { user } = useAuth();
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setActiveCount(0);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'listings'),
      where('seller.uid', '==', user.uid),
      where('status', '==', 'active'),
    );
    const unsub = onSnapshot(q, snap => {
      setActiveCount(snap.size);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return { activeCount, loading };
}
