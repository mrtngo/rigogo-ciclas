const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string;

function storageUrl(path: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`;
}

export const LOGOS = {
  blanco: storageUrl('assets/logo_blanco.png'),
  verde:  storageUrl('assets/logo_verde.png'),
  negro:  storageUrl('assets/logo_negro.png'),
};

export const ISOTIPOS = {
  blanco: storageUrl('assets/isotipo_blanco.png'),
  verde:  storageUrl('assets/isotipo_verde.png'),
  negro:  storageUrl('assets/isotipo_negro.png'),
};
