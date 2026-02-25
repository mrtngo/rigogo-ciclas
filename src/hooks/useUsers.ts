import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserRecord {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    createdAt?: Timestamp;
    lastLoginAt?: Timestamp;
}

export function useUsers() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setUsers(snapshot.docs.map(d => ({ uid: d.id, ...d.data() } as UserRecord)));
                setLoading(false);
            },
            () => setLoading(false),
        );
        return unsubscribe;
    }, []);

    return { users, loading };
}
