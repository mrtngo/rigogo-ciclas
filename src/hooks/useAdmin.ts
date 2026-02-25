import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export function useAdmin() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsAdmin(false);
            setLoading(false);
            return;
        }

        getDoc(doc(db, 'admins', user.uid))
            .then((snap) => {
                setIsAdmin(snap.exists());
                setLoading(false);
            })
            .catch(() => {
                setIsAdmin(false);
                setLoading(false);
            });
    }, [user]);

    return { isAdmin, loading };
}
