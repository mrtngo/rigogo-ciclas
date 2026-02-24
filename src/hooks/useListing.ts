import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Product, Listing } from '../types/product';
import { listingToProduct } from '../types/product';

export function useListing(id: string | undefined) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        getDoc(doc(db, 'listings', id))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setProduct(listingToProduct({ id: snapshot.id, ...snapshot.data() } as Listing));
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    return { product, loading };
}
