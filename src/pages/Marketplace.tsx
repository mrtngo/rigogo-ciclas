import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Marketplace.css';
import { Filter, Search } from 'lucide-react';

const Marketplace: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedSize, setSelectedSize] = useState('Todas');
    const [selectedCondition, setSelectedCondition] = useState('Todas');

    const filteredProducts = MOCK_PRODUCTS.filter(p => {
        const matchesSearch = p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
        const matchesSize = selectedSize === 'Todas' || p.size === selectedSize;
        const matchesCondition = selectedCondition === 'Todas' || p.condition === selectedCondition;
        return matchesSearch && matchesCategory && matchesSize && matchesCondition;
    });

    return (
        <div className="marketplace-page container animate-fade-in">
            <header className="marketplace-header">
                <div>
                    <h1>Bicicletas Disponibles</h1>
                    <p className="text-muted">Encuentra la bicicleta perfecta, inspeccionada y certificada.</p>
                </div>
                <div className="marketplace-controls">
                    <div className="search-bar">
                        <Search size={18} className="search-icon-static" />
                        <input
                            type="text"
                            placeholder="Buscar por marca o modelo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="filter-toggle btn-secondary mobile-only">
                        <Filter size={20} />
                        <span>Filtros</span>
                    </button>
                </div>
            </header>

            <div className="marketplace-layout">
                <aside className="filters-sidebar desktop-only">
                    <div className="filter-group">
                        <h3>Categoría</h3>
                        <div className="filter-options">
                            {['Todas', 'Ruta', 'MTB', 'Gravel', 'Urbana', 'E-Bike'].map(cat => (
                                <button
                                    key={cat}
                                    className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Talla</h3>
                        <div className="filter-tags">
                            {['Todas', 'XS', 'S', 'M', 'L', 'XL'].map(size => (
                                <button
                                    key={size}
                                    className={`tag-btn ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Estado</h3>
                        <div className="filter-options">
                            {['Todas', 'Nuevo', 'Como nuevo', 'Excelente', 'Buen estado'].map(cond => (
                                <label key={cond} className="filter-radio">
                                    <input
                                        type="radio"
                                        name="condition"
                                        checked={selectedCondition === cond}
                                        onChange={() => setSelectedCondition(cond)}
                                    />
                                    <span>{cond}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <section className="products-grid">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="no-results">
                            <p>No encontramos bicicletas con esos criterios.</p>
                            <button className="btn-secondary" onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('Todas');
                                setSelectedSize('Todas');
                                setSelectedCondition('Todas');
                            }}>
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Marketplace;
