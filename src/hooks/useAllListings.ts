import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Listing } from '../types/product';

export function useAllListings() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'listings'),
            orderBy('createdAt', 'desc'),
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                } as Listing));
                setListings(data);
                setLoading(false);
            },
            () => {
                setLoading(false);
            },
        );

        return unsubscribe;
    }, []);

    return { listings, loading };
}
