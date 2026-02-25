import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../hooks/useAdmin';

export function AdminRoute({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { isAdmin, loading } = useAdmin();
    const location = useLocation();

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (loading) return null;
    if (!isAdmin) return <Navigate to="/" replace />;

    return <>{children}</>;
}
