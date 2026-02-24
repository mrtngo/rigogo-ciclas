import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
    'auth/user-not-found': 'No existe una cuenta con este correo.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ya existe una cuenta con este correo.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/popup-closed-by-user': 'Cancelaste el inicio de sesión con Google.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde.',
};

function getErrorMessage(code: string): string {
    return FIREBASE_ERROR_MESSAGES[code] ?? 'Ocurrió un error. Intenta de nuevo.';
}

async function upsertUserDoc(uid: string, email: string | null, displayName: string | null, photoURL: string | null, isNew: boolean) {
    const ref = doc(db, 'users', uid);
    if (isNew) {
        await setDoc(ref, {
            email,
            displayName,
            photoURL,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
        });
    } else {
        await setDoc(ref, { lastLoginAt: serverTimestamp() }, { merge: true });
    }
}

export default function Login() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

    const [tab, setTab] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to={from} replace />;

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            await upsertUserDoc(cred.user.uid, cred.user.email, cred.user.displayName, cred.user.photoURL, false);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const code = (err as { code?: string }).code ?? '';
            setError(getErrorMessage(code));
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: name });
            await upsertUserDoc(cred.user.uid, email, name, null, true);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const code = (err as { code?: string }).code ?? '';
            setError(getErrorMessage(code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const cred = await signInWithPopup(auth, provider);
            const isNew = cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime;
            await upsertUserDoc(cred.user.uid, cred.user.email, cred.user.displayName, cred.user.photoURL, isNew);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const code = (err as { code?: string }).code ?? '';
            setError(getErrorMessage(code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page container animate-fade-in">
            <div className="login-card">
                <h2>Bienvenido Mijito</h2>
                <p>Ingresa a tu cuenta de GO RIGO GO!</p>

                <div className="login-tabs">
                    <button
                        className={`login-tab ${tab === 'signin' ? 'active' : ''}`}
                        onClick={() => { setTab('signin'); setError(''); }}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        className={`login-tab ${tab === 'signup' ? 'active' : ''}`}
                        onClick={() => { setTab('signup'); setError(''); }}
                    >
                        Registrarse
                    </button>
                </div>

                {error && <div className="login-error">{error}</div>}

                {tab === 'signin' ? (
                    <form onSubmit={handleSignIn}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="mijito@rigo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn-primary login-submit" type="submit" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignUp}>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="mijito@rigo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Mín. 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn-primary login-submit" type="submit" disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                    </form>
                )}

                <div className="login-divider"><span>o</span></div>

                <button className="btn-google" onClick={handleGoogle} disabled={loading}>
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
                        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/>
                    </svg>
                    Continuar con Google
                </button>
            </div>
        </div>
    );
}
