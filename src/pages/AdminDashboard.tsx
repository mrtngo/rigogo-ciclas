import React, { useEffect, useState } from 'react';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import {
    LayoutDashboard, Bike, Clock, ShoppingBag, Users,
    Settings, CheckCircle, XCircle, Trash2, TrendingUp,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { useAllListings } from '../hooks/useAllListings';
import { useUsers } from '../hooks/useUsers';
import { useSiteSettings } from '../hooks/useSiteSettings';
import type { Listing } from '../types/product';
import './AdminDashboard.css';

type AdminView = 'dashboard' | 'listings' | 'users' | 'settings';
type StatusFilter = 'all' | 'pending' | 'active' | 'sold' | 'rejected';

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente', active: 'Activo', sold: 'Vendido', rejected: 'Rechazado',
};
const STATUS_CLASSES: Record<string, string> = {
    pending: 'badge-pending', active: 'badge-active', sold: 'badge-sold', rejected: 'badge-rejected',
};

const FMT_COP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

function fmtDate(ts?: { toDate(): Date }): string {
    if (!ts) return '—';
    try { return ts.toDate().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return '—'; }
}

async function setStatus(id: string, status: Listing['status']) {
    await updateDoc(doc(db, 'listings', id), { status, updatedAt: serverTimestamp() });
}
async function removeListing(id: string) {
    await deleteDoc(doc(db, 'listings', id));
}

const AdminDashboard: React.FC = () => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
    const { listings, loading: listingsLoading } = useAllListings();
    const { users, loading: usersLoading } = useUsers();
    const { settings, save: saveSettings } = useSiteSettings();
    const [announcementDraft, setAnnouncementDraft] = useState('');
    const [settingsSaved, setSettingsSaved] = useState(false);

    useEffect(() => { setAnnouncementDraft(settings.announcementText); }, [settings.announcementText]);

    const counts = {
        all: listings.length,
        pending: listings.filter(l => l.status === 'pending').length,
        active: listings.filter(l => l.status === 'active').length,
        sold: listings.filter(l => l.status === 'sold').length,
        rejected: listings.filter(l => l.status === 'rejected').length,
    };

    const totalRevenue = listings.filter(l => l.status === 'sold').reduce((s, l) => s + l.price, 0);

    const categoryBreakdown = Object.entries(
        listings.reduce<Record<string, number>>((acc, l) => {
            acc[l.category] = (acc[l.category] ?? 0) + 1;
            return acc;
        }, {}),
    ).sort((a, b) => b[1] - a[1]);
    const maxCatCount = Math.max(...categoryBreakdown.map(c => c[1]), 1);

    const visibleListings = statusFilter === 'all' ? listings : listings.filter(l => l.status === statusFilter);

    const handleSaveSettings = async () => {
        await saveSettings({ announcementText: announcementDraft });
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header"><h2>Panel Admin</h2></div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
                        <LayoutDashboard size={20} /> Dashboard
                    </button>

                    <button className={`nav-item ${view === 'listings' ? 'active' : ''}`} onClick={() => setView('listings')}>
                        <Bike size={20} /> Anuncios
                        {counts.pending > 0 && <span className="nav-badge pending">{counts.pending}</span>}
                    </button>
                    {view === 'listings' && (
                        <div className="nav-subitems">
                            {(['pending', 'active', 'sold', 'all'] as StatusFilter[]).map(s => (
                                <button
                                    key={s}
                                    className={`nav-subitem ${statusFilter === s ? 'active' : ''}`}
                                    onClick={() => setStatusFilter(s)}
                                >
                                    {s === 'pending' ? 'Pendientes' : s === 'active' ? 'Activos' : s === 'sold' ? 'Vendidos' : 'Todos'}
                                    <span className="nav-badge">{s === 'all' ? counts.all : counts[s]}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <button className={`nav-item ${view === 'users' ? 'active' : ''}`} onClick={() => setView('users')}>
                        <Users size={20} /> Usuarios
                        <span className="nav-badge">{users.length}</span>
                    </button>

                    <button className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>
                        <Settings size={20} /> Ajustes
                    </button>
                </nav>
            </aside>

            {/* Main */}
            <main className="admin-main">

                {/* ── DASHBOARD ── */}
                {view === 'dashboard' && (
                    <>
                        <header className="admin-header"><h1>Dashboard</h1></header>

                        <section className="stats-grid stats-grid-5">
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#e0e7ff' }}><Users size={20} style={{ color: '#4338ca' }} /></div>
                                <h3>Usuarios</h3>
                                <p className="stat-value">{users.length}</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#d1fae5' }}><Bike size={20} style={{ color: '#059669' }} /></div>
                                <h3>Anuncios Activos</h3>
                                <p className="stat-value" style={{ color: '#059669' }}>{counts.active}</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#fef3c7' }}><Clock size={20} style={{ color: '#d97706' }} /></div>
                                <h3>Pendientes</h3>
                                <p className="stat-value" style={{ color: '#d97706' }}>{counts.pending}</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#ede9fe' }}><ShoppingBag size={20} style={{ color: '#7c3aed' }} /></div>
                                <h3>Vendidos</h3>
                                <p className="stat-value" style={{ color: '#7c3aed' }}>{counts.sold}</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#d1fae5' }}><TrendingUp size={20} style={{ color: '#059669' }} /></div>
                                <h3>Ingresos Estimados</h3>
                                <p className="stat-value stat-value-sm">{FMT_COP.format(totalRevenue)}</p>
                            </div>
                        </section>

                        <div className="dashboard-grid">
                            <section className="admin-card">
                                <h2>Por Categoría</h2>
                                <div className="category-list">
                                    {categoryBreakdown.length === 0 ? (
                                        <p className="empty-note">Sin datos aún.</p>
                                    ) : categoryBreakdown.map(([cat, count]) => (
                                        <div key={cat} className="category-row">
                                            <span className="cat-label">{cat}</span>
                                            <div className="cat-bar-track">
                                                <div className="cat-bar-fill" style={{ width: `${(count / maxCatCount) * 100}%` }} />
                                            </div>
                                            <span className="cat-count">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="admin-card">
                                <h2>Últimos Anuncios</h2>
                                <div className="recent-list">
                                    {listings.slice(0, 6).map(l => (
                                        <div key={l.id} className="recent-item">
                                            {l.images[0]
                                                ? <img src={l.images[0]} alt="" className="recent-thumb" />
                                                : <div className="recent-thumb img-placeholder"><Bike size={14} /></div>
                                            }
                                            <div className="recent-info">
                                                <strong>{l.brand} {l.model}</strong>
                                                <span>{l.seller.name} · {fmtDate(l.createdAt)}</span>
                                            </div>
                                            <span className={`status-badge ${STATUS_CLASSES[l.status] ?? ''}`}>
                                                {STATUS_LABELS[l.status] ?? l.status}
                                            </span>
                                        </div>
                                    ))}
                                    {listings.length === 0 && <p className="empty-note">Sin anuncios aún.</p>}
                                </div>
                            </section>
                        </div>
                    </>
                )}

                {/* ── LISTINGS ── */}
                {view === 'listings' && (
                    <>
                        <header className="admin-header">
                            <h1>
                                {statusFilter === 'pending' ? 'Pendientes de Revisión'
                                    : statusFilter === 'active' ? 'Anuncios Activos'
                                    : statusFilter === 'sold' ? 'Vendidos'
                                    : 'Todos los Anuncios'}
                            </h1>
                        </header>
                        <div className="inventory-table-container">
                            {listingsLoading ? (
                                <div className="table-empty">Cargando anuncios...</div>
                            ) : visibleListings.length === 0 ? (
                                <div className="table-empty">No hay anuncios en esta categoría.</div>
                            ) : (
                                <table className="inventory-table">
                                    <thead>
                                        <tr>
                                            <th>Bicicleta</th>
                                            <th>Vendedor</th>
                                            <th>Precio</th>
                                            <th>Estado</th>
                                            <th>Fecha</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleListings.map(l => (
                                            <tr key={l.id}>
                                                <td>
                                                    <div className="product-cell">
                                                        {l.images[0]
                                                            ? <img src={l.images[0]} alt="" />
                                                            : <div className="img-placeholder"><Bike size={20} /></div>}
                                                        <div>
                                                            <strong>{l.brand} {l.model}</strong>
                                                            <span>{l.year} · {l.size} · {l.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="seller-cell">
                                                        <span>{l.seller.name}</span>
                                                        <span className="seller-location">{l.seller.location}</span>
                                                    </div>
                                                </td>
                                                <td><strong>{FMT_COP.format(l.price)}</strong></td>
                                                <td><span className={`status-badge ${STATUS_CLASSES[l.status] ?? ''}`}>{STATUS_LABELS[l.status] ?? l.status}</span></td>
                                                <td className="date-cell">{fmtDate(l.createdAt)}</td>
                                                <td className="actions-cell">
                                                    {(l.status === 'pending' || l.status === 'rejected') && (
                                                        <button className="action-btn approve" title="Aprobar" onClick={() => setStatus(l.id, 'active')}>
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {(l.status === 'pending' || l.status === 'active') && (
                                                        <button className="action-btn reject" title="Rechazar" onClick={() => setStatus(l.id, 'rejected')}>
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button className="action-btn delete" title="Eliminar" onClick={() => removeListing(l.id)}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {/* ── USERS ── */}
                {view === 'users' && (
                    <>
                        <header className="admin-header"><h1>Usuarios Registrados</h1></header>
                        <div className="inventory-table-container">
                            {usersLoading ? (
                                <div className="table-empty">Cargando usuarios...</div>
                            ) : users.length === 0 ? (
                                <div className="table-empty">No hay usuarios registrados aún.</div>
                            ) : (
                                <table className="inventory-table">
                                    <thead>
                                        <tr>
                                            <th>Usuario</th>
                                            <th>Email</th>
                                            <th>Registro</th>
                                            <th>Último acceso</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => {
                                            const letter = u.displayName?.[0]?.toUpperCase() ?? u.email?.[0]?.toUpperCase() ?? '?';
                                            return (
                                                <tr key={u.uid}>
                                                    <td>
                                                        <div className="product-cell">
                                                            {u.photoURL
                                                                ? <img src={u.photoURL} alt="" className="user-table-avatar" />
                                                                : <div className="user-table-avatar user-initial">{letter}</div>
                                                            }
                                                            <div>
                                                                <strong>{u.displayName ?? '—'}</strong>
                                                                <span className="seller-location">{u.uid.slice(0, 12)}…</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{u.email ?? '—'}</td>
                                                    <td>{fmtDate(u.createdAt)}</td>
                                                    <td>{fmtDate(u.lastLoginAt)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {/* ── SETTINGS ── */}
                {view === 'settings' && (
                    <>
                        <header className="admin-header"><h1>Ajustes del Sitio</h1></header>
                        <div className="settings-panel">
                            <div className="admin-card">
                                <h2>Barra de Anuncio</h2>
                                <p className="settings-desc">El texto que aparece en la barra superior del sitio. Los cambios se aplican en tiempo real.</p>
                                <div className="form-group" style={{ marginTop: '1.25rem' }}>
                                    <label>Texto del anuncio</label>
                                    <input
                                        type="text"
                                        className="settings-input"
                                        value={announcementDraft}
                                        onChange={e => setAnnouncementDraft(e.target.value)}
                                    />
                                </div>
                                <div className="settings-preview">
                                    <span className="settings-preview-label">Vista previa</span>
                                    <div className="settings-preview-bar">{announcementDraft}</div>
                                </div>
                                <button className="btn-primary settings-save" onClick={handleSaveSettings}>
                                    {settingsSaved ? '¡Guardado!' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
