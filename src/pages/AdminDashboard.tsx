import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, XCircle, Trash2, LayoutDashboard, Bike, Clock, ShoppingBag } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAllListings } from '../hooks/useAllListings';
import type { Listing } from '../types/product';
import './AdminDashboard.css';

type StatusFilter = 'all' | 'pending' | 'active' | 'sold' | 'rejected';

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente',
    active: 'Activo',
    sold: 'Vendido',
    rejected: 'Rechazado',
};

const STATUS_CLASSES: Record<string, string> = {
    pending: 'badge-pending',
    active: 'badge-active',
    sold: 'badge-sold',
    rejected: 'badge-rejected',
};

async function setStatus(id: string, status: Listing['status']) {
    await updateDoc(doc(db, 'listings', id), { status, updatedAt: serverTimestamp() });
}

async function removeListing(id: string) {
    await deleteDoc(doc(db, 'listings', id));
}

const AdminDashboard: React.FC = () => {
    const { listings, loading } = useAllListings();
    const [filter, setFilter] = useState<StatusFilter>('pending');

    const counts = {
        all: listings.length,
        pending: listings.filter(l => l.status === 'pending').length,
        active: listings.filter(l => l.status === 'active').length,
        sold: listings.filter(l => l.status === 'sold').length,
        rejected: listings.filter(l => l.status === 'rejected').length,
    };

    const visible = filter === 'all' ? listings : listings.filter(l => l.status === filter);

    const formatPrice = (n: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Panel Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        <LayoutDashboard size={20} /> Todos
                        <span className="nav-badge">{counts.all}</span>
                    </button>
                    <button
                        className={`nav-item ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        <Clock size={20} /> Pendientes
                        {counts.pending > 0 && <span className="nav-badge pending">{counts.pending}</span>}
                    </button>
                    <button
                        className={`nav-item ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        <Bike size={20} /> Activos
                        <span className="nav-badge">{counts.active}</span>
                    </button>
                    <button
                        className={`nav-item ${filter === 'sold' ? 'active' : ''}`}
                        onClick={() => setFilter('sold')}
                    >
                        <ShoppingBag size={20} /> Vendidos
                        <span className="nav-badge">{counts.sold}</span>
                    </button>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>
                        {filter === 'all' && 'Todos los Anuncios'}
                        {filter === 'pending' && 'Pendientes de Revisión'}
                        {filter === 'active' && 'Anuncios Activos'}
                        {filter === 'sold' && 'Vendidos'}
                        {filter === 'rejected' && 'Rechazados'}
                    </h1>
                </header>

                <section className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Anuncios</h3>
                        <p className="stat-value">{counts.all}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pendientes</h3>
                        <p className="stat-value" style={{ color: '#d97706' }}>{counts.pending}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Activos</h3>
                        <p className="stat-value" style={{ color: '#059669' }}>{counts.active}</p>
                    </div>
                </section>

                <div className="inventory-table-container">
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            Cargando anuncios...
                        </div>
                    ) : visible.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No hay anuncios en esta categoría.
                        </div>
                    ) : (
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Bicicleta</th>
                                    <th>Vendedor</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map(listing => (
                                    <tr key={listing.id}>
                                        <td>
                                            <div className="product-cell">
                                                {listing.images[0] ? (
                                                    <img src={listing.images[0]} alt="" />
                                                ) : (
                                                    <div className="img-placeholder"><Bike size={20} /></div>
                                                )}
                                                <div>
                                                    <strong>{listing.brand} {listing.model}</strong>
                                                    <span>{listing.year} · Talla {listing.size} · {listing.category}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="seller-cell">
                                                <span>{listing.seller.name}</span>
                                                <span className="seller-location">{listing.seller.location}</span>
                                            </div>
                                        </td>
                                        <td><strong>{formatPrice(listing.price)}</strong></td>
                                        <td>
                                            <span className={`status-badge ${STATUS_CLASSES[listing.status] ?? ''}`}>
                                                {STATUS_LABELS[listing.status] ?? listing.status}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            {listing.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="action-btn approve"
                                                        title="Aprobar"
                                                        onClick={() => setStatus(listing.id, 'active')}
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        title="Rechazar"
                                                        onClick={() => setStatus(listing.id, 'rejected')}
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                            {listing.status === 'active' && (
                                                <button
                                                    className="action-btn reject"
                                                    title="Desactivar"
                                                    onClick={() => setStatus(listing.id, 'rejected')}
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                            {listing.status === 'rejected' && (
                                                <button
                                                    className="action-btn approve"
                                                    title="Reactivar"
                                                    onClick={() => setStatus(listing.id, 'active')}
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button
                                                className="action-btn delete"
                                                title="Eliminar"
                                                onClick={() => removeListing(listing.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
