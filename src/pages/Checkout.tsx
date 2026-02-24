import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/products';
import { CreditCard, Truck, ShieldCheck, CheckCircle, ChevronLeft } from 'lucide-react';
import './Checkout.css';

const Checkout: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    const [step, setStep] = useState(1);
    const [shipping, setShipping] = useState('domicilio');

    if (!product) {
        return (
            <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
                <h2>Producto no encontrado para checkout.</h2>
                <Link to="/marketplace" className="btn-primary" style={{ display: 'inline-flex', marginTop: '2rem' }}>Volver al Marketplace</Link>
            </div>
        );
    }

    const priceCOP = product.price;
    const shippingCost = shipping === 'domicilio' ? 150000 : 0;
    const total = priceCOP + shippingCost;

    const formattedPrice = (price: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(price);

    const handleConfirm = () => {
        setStep(3);
    };

    if (step === 3) {
        return (
            <div className="checkout-page container action-container animate-fade-in">
                <div className="success-wrapper">
                    <CheckCircle size={64} className="success-icon" />
                    <h2>¡Pago Confirmado!</h2>
                    <p>Tu compra está asegurada. El vendedor ha sido notificado y preparará el envío de tu {product.brand}.</p>
                    <div className="order-details-box">
                        <p><strong>Número de Orden:</strong> #RIGO-{Math.floor(Math.random() * 100000)}</p>
                        <p><strong>Total Pagado:</strong> {formattedPrice(total)}</p>
                    </div>
                    <button className="btn-primary" onClick={() => navigate('/marketplace')}>Seguir Comprando</button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page container animate-fade-in">
            <button className="btn-back" onClick={() => navigate(`/product/${product.id}`)}>
                <ChevronLeft size={20} /> Volver al producto
            </button>
            <div className="checkout-layout">
                {/* Main Checkout Flow */}
                <div className="checkout-main">
                    <h1>Finalizar Compra</h1>

                    <div className="checkout-section">
                        <div className="section-header">
                            <Truck size={24} className="section-icon" />
                            <h2>Opciones de Envío</h2>
                        </div>
                        <div className="shipping-options">
                            <label className={`shipping-card ${shipping === 'domicilio' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="shipping"
                                    checked={shipping === 'domicilio'}
                                    onChange={() => setShipping('domicilio')}
                                />
                                <div className="shipping-info">
                                    <strong>Envío a Domicilio Asegurado</strong>
                                    <span className="text-muted">Entrega en 3-5 días hábiles a cualquier parte del país.</span>
                                </div>
                                <span className="shipping-price">{formattedPrice(150000)}</span>
                            </label>

                            <label className={`shipping-card ${shipping === 'local' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="shipping"
                                    checked={shipping === 'local'}
                                    onChange={() => setShipping('local')}
                                />
                                <div className="shipping-info">
                                    <strong>Recogida Local (Punto GO RIGO GO!)</strong>
                                    <span className="text-muted">Recoge tu bici en nuestro taller en 24h.</span>
                                </div>
                                <span className="shipping-price">Gratis</span>
                            </label>
                        </div>
                    </div>

                    <div className="checkout-section">
                        <div className="section-header">
                            <CreditCard size={24} className="section-icon" />
                            <h2>Método de Pago</h2>
                        </div>
                        <div className="payment-options">
                            <div className="form-group mb-0">
                                <label>Número de Tarjeta</label>
                                <input type="text" className="form-input" placeholder="0000 0000 0000 0000" />
                            </div>
                            <div className="form-row">
                                <div className="form-group mb-0">
                                    <label>Fecha de Expiración</label>
                                    <input type="text" className="form-input" placeholder="MM/YY" />
                                </div>
                                <div className="form-group mb-0">
                                    <label>CVC</label>
                                    <input type="text" className="form-input" placeholder="123" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="checkout-sidebar">
                    <div className="order-summary-card">
                        <h3>Resumen de la Orden</h3>
                        <div className="summary-product">
                            <img src={product.images[0]} alt={product.model} />
                            <div className="summary-product-info">
                                <strong>{product.brand} {product.model}</strong>
                                <span>Talla {product.size} | {product.condition}</span>
                            </div>
                        </div>

                        <div className="summary-costs">
                            <div className="cost-row">
                                <span>Subtotal</span>
                                <span>{formattedPrice(priceCOP)}</span>
                            </div>
                            <div className="cost-row">
                                <span>Envío</span>
                                <span>{shippingCost === 0 ? 'Gratis' : formattedPrice(shippingCost)}</span>
                            </div>
                            <div className="cost-row total">
                                <span>Total</span>
                                <span>{formattedPrice(total)}</span>
                            </div>
                        </div>

                        <div className="buyer-protection">
                            <ShieldCheck size={20} className="protection-icon" />
                            <p><strong>Protección al Comprador:</strong> Retenemos tu pago hasta que recibas y apruebes la bicicleta. Garantía de 48h.</p>
                        </div>

                        <button className="btn-primary pay-btn" onClick={handleConfirm}>
                            Pagar {formattedPrice(total)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
