import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Marketplace.css';
import { Filter } from 'lucide-react';

const Marketplace: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');

    const filteredProducts = MOCK_PRODUCTS.filter(p => {
        const matchesSearch = p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="marketplace-page container animate-fade-in">
            <header className="marketplace-header">
                <h1>Explora el Marketplace</h1>
                <div className="marketplace-controls">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Marca, modelo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="filter-toggle btn-outline">
                        <Filter size={20} />
                        <span>Filtros Avanzados</span>
                    </button>
                </div>
            </header>

            <div className="marketplace-layout">
                <aside className="filters-sidebar desktop-only">
                    <h3>Categorías</h3>
                    <div className="filter-options">
                        {['Todas', 'Ruta', 'MTB', 'Gravel', 'E-Bike', 'Urbana'].map(cat => (
                            <button
                                key={cat}
                                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <h3>Precio</h3>
                    <div className="range-filter">
                        <input type="range" min="0" max="50000000" step="1000000" />
                        <div className="range-labels">
                            <span>$0</span>
                            <span>$50M</span>
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
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Marketplace;
