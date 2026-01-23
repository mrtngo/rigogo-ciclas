import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import { Plus, Trash2, Edit, LayoutDashboard, Bike, Settings } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const [products] = useState(MOCK_PRODUCTS);
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Panel Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    <button className="nav-item active"><LayoutDashboard size={20} /> Dashboard</button>
                    <button className="nav-item"><Bike size={20} /> Inventario</button>
                    <button className="nav-item"><Settings size={20} /> Ajustes</button>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Gestión de Productos</h1>
                    <button className="btn-primary" onClick={() => setShowAddForm(true)}>
                        <Plus size={20} /> Nuevo Producto
                    </button>
                </header>

                <section className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Bicis</h3>
                        <p className="stat-value">{products.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Ventas Mes</h3>
                        <p className="stat-value">12</p>
                    </div>
                    <div className="stat-card">
                        <h3>Valor Inventario</h3>
                        <p className="stat-value">$240M</p>
                    </div>
                </section>

                <div className="inventory-table-container">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="product-cell">
                                            <img src={p.images[0]} alt="" />
                                            <div>
                                                <strong>{p.brand} {p.model}</strong>
                                                <span>{p.year} - Talla {p.size}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{p.category}</td>
                                    <td>{new Intl.NumberFormat('es-CO').format(p.price)}</td>
                                    <td><span className={`status-badge ${p.condition.toLowerCase().replace(' ', '-')}`}>{p.condition}</span></td>
                                    <td className="actions-cell">
                                        <button className="action-btn edit"><Edit size={18} /></button>
                                        <button className="action-btn delete"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Agregar Nueva Bicicleta</h2>
                        <form className="add-product-form" onSubmit={(e) => { e.preventDefault(); setShowAddForm(false); }}>
                            <div className="form-group">
                                <label>Marca</label>
                                <input type="text" placeholder="Ej: Specialized" required />
                            </div>
                            <div className="form-group">
                                <label>Modelo</label>
                                <input type="text" placeholder="Ej: Tarmac SL8" required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Año</label>
                                    <input type="number" defaultValue={2024} required />
                                </div>
                                <div className="form-group">
                                    <label>Precio (COP)</label>
                                    <input type="number" placeholder="0" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea rows={3}></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-outline" onClick={() => setShowAddForm(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary">Guardar Producto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
