import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SiteSettings {
    announcementText: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
    announcementText: 'REGÍSTRATE HOY, PUBLICA Y VENDE TU BICI. ¡FÁCIL Y RÁPIDO!',
};

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, 'settings', 'site'),
            (snap) => {
                if (snap.exists()) {
                    setSettings({ ...DEFAULT_SETTINGS, ...(snap.data() as SiteSettings) });
                }
                setLoading(false);
            },
            () => setLoading(false),
        );
        return unsubscribe;
    }, []);

    const save = (updates: Partial<SiteSettings>) =>
        setDoc(doc(db, 'settings', 'site'), { ...settings, ...updates }, { merge: true });

    return { settings, loading, save };
}
