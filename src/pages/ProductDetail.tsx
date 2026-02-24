import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/products';
import { ChevronLeft, Shield, Truck, RotateCcw, MessageSquare, ShoppingCart, Star, ShieldCheck } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    const [activeImage, setActiveImage] = useState(0);

    if (!product) {
        return (
            <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
                <h2>Mijito, esa bici ya se nos fue...</h2>
                <Link to="/marketplace" className="btn-primary" style={{ display: 'inline-flex', marginTop: '2rem' }}>Volver al Marketplace</Link>
            </div>
        );
    }

    const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(product.price);

    return (
        <div className="product-detail-page animate-fade-in">
            <div className="container">
                <Link to="/marketplace" className="back-link">
                    <ChevronLeft size={20} /> Volver al Marketplace
                </Link>

                <div className="product-main-layout">
                    {/* Gallery Section */}
                    <section className="product-gallery">
                        <div className="main-image">
                            <img src={product.images[activeImage]} alt={product.model} />
                            <span className="condition-badge">
                                <ShieldCheck size={16} /> {product.condition}
                            </span>
                        </div>
                        <div className="image-thumbs">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`thumb ${activeImage === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img src={img} alt="" />
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Info Section */}
                    <section className="product-purchase">
                        <header className="product-header">
                            <h1>{product.brand} {product.model}</h1>
                            <div className="product-meta">
                                <span className="year">{product.year}</span>
                                <span className="divider">•</span>
                                <span className="category">{product.category}</span>
                                <span className="divider">•</span>
                                <div className="rating">
                                    <Star size={16} fill="currentColor" />
                                    <span>{product.seller.rating}</span>
                                </div>
                            </div>
                        </header>

                        <div className="product-price-section">
                            <span className="price-label">Precio</span>
                            <h2 className="price">{formattedPrice}</h2>
                            <p className="shipping-note">Incluye inspección técnica y garantía GO RIGO GO!</p>
                        </div>

                        <div className="purchase-actions">
                            <button className="btn-primary buy-btn" onClick={() => navigate(`/checkout/${product.id}`)}>
                                <ShoppingCart size={20} /> Comprar Ahora
                            </button>
                            <button className="btn-secondary">
                                <MessageSquare size={20} /> Hacer una Oferta
                            </button>
                        </div>

                        <div className="trust-points">
                            <div className="trust-item">
                                <Shield size={20} className="icon" />
                                <div>
                                    <strong>Compra Protegida</strong>
                                    <span>Tu dinero está seguro hasta que recibas la bici.</span>
                                </div>
                            </div>
                            <div className="trust-item">
                                <Truck size={20} className="icon" />
                                <div>
                                    <strong>Transporte Incluido</strong>
                                    <span>Nos encargamos del envío a cualquier parte de Colombia.</span>
                                </div>
                            </div>
                            <div className="trust-item">
                                <RotateCcw size={20} className="icon" />
                                <div>
                                    <strong>Garantía de Devolución</strong>
                                    <span>¿No es lo que esperabas? Tienes 48h para devolverla.</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Specs Section */}
                <section className="product-specs-detailed">
                    <h2>Especificaciones Técnicas</h2>
                    <div className="specs-grid">
                        <div className="spec-item">
                            <span className="label">Cuadro</span>
                            <span className="value">{product.specs.frame}</span>
                        </div>
                        <div className="spec-item">
                            <span className="label">Grupo</span>
                            <span className="value">{product.specs.groupset}</span>
                        </div>
                        <div className="spec-item">
                            <span className="label">Ruedas</span>
                            <span className="value">{product.specs.wheels}</span>
                        </div>
                        <div className="spec-item">
                            <span className="label">Talla</span>
                            <span className="value">{product.size}</span>
                        </div>
                        {product.specs.weight && (
                            <div className="spec-item">
                                <span className="label">Peso</span>
                                <span className="value">{product.specs.weight}</span>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetail;
