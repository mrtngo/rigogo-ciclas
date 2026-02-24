import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Product, Listing } from '../types/product';
import { listingToProduct } from '../types/product';

export function useListings() {
    const [listings, setListings] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'listings'),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc'),
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const products = snapshot.docs.map((d) =>
                    listingToProduct({ id: d.id, ...d.data() } as Listing),
                );
                setListings(products);
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
