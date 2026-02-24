import React, { useState } from 'react';
import { Camera, Tag, CheckCircle, ChevronRight, ChevronLeft, Upload, Bike } from 'lucide-react';
import './Vender.css';
import { Link } from 'react-router-dom';

const Vender: React.FC = () => {
    const [step, setStep] = useState(0); // 0 is landing, 1-4 are form steps, 5 is success

    const handleNext = () => setStep(s => Math.min(s + 1, 5));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    // Render Landing
    if (step === 0) {
        return (
            <div className="vender-page animate-fade-in">
                <section className="vender-hero">
                    <div className="container">
                        <h1>Vende tu bici en <span className="highlight">minutos</span></h1>
                        <p>Llega a miles de ciclistas apasionados. Es rápido, seguro y fácil.</p>
                        <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => setStep(1)}>
                            Empezar a Vender
                        </button>
                    </div>
                </section>

                <section className="container vender-steps">
                    <div className="step-card">
                        <div className="step-icon"><Bike size={32} /></div>
                        <h3>1. Datos Básicos</h3>
                        <p>Dinos la marca, modelo y año de tu máquina.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon"><Camera size={32} /></div>
                        <h3>2. Sube fotos</h3>
                        <p>Toma fotos reales donde se aprecie bien el estado y los componentes.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon"><Tag size={32} /></div>
                        <h3>3. Pon un precio</h3>
                        <p>Elige cuánto quieres recibir. Nosotros hacemos el resto.</p>
                    </div>
                </section>
            </div>
        );
    }

    // Render Success
    if (step === 5) {
        return (
            <div className="vender-page container action-container animate-fade-in">
                <div className="success-wrapper">
                    <CheckCircle size={64} className="success-icon" />
                    <h2>¡Publicación Exitosa!</h2>
                    <p>Tu bicicleta ha sido enviada a revisión. Estará visible en el catálogo muy pronto.</p>
                    <Link to="/marketplace" className="btn-primary">Ver Catálogo</Link>
                </div>
            </div>
        );
    }

    // Render Form Steps
    return (
        <div className="vender-page container form-container animate-fade-in">
            <div className="form-header">
                <button className="btn-back" onClick={handleBack}>
                    <ChevronLeft size={20} /> Atrás
                </button>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                </div>
                <span>Paso {step} de 4</span>
            </div>

            <div className="form-content">
                {step === 1 && (
                    <div className="form-step animate-slide-in">
                        <h2>Empecemos con lo básico</h2>
                        <p className="text-muted">Cuéntanos sobre tu bicicleta.</p>

                        <div className="form-group">
                            <label>Marca</label>
                            <select className="form-input">
                                <option value="">Selecciona una marca</option>
                                <option value="Specialized">Specialized</option>
                                <option value="Trek">Trek</option>
                                <option value="Giant">Giant</option>
                                <option value="Pinarello">Pinarello</option>
                                <option value="Otra">Otra</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Modelo</label>
                            <input type="text" className="form-input" placeholder="Ej. Tarmac SL7" />
                        </div>
                        <div className="form-group">
                            <label>Año</label>
                            <input type="number" className="form-input" placeholder="Ej. 2022" />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step animate-slide-in">
                        <h2>Detalles y Estado</h2>
                        <p className="text-muted">Información clave para los compradores.</p>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Categoría</label>
                                <select className="form-input">
                                    <option value="Ruta">Ruta</option>
                                    <option value="MTB">MTB</option>
                                    <option value="Gravel">Gravel</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Talla</label>
                                <select className="form-input">
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Estado General</label>
                            <select className="form-input">
                                <option value="Como nuevo">Como nuevo</option>
                                <option value="Excelente">Excelente</option>
                                <option value="Buen estado">Buen estado</option>
                            </select>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step animate-slide-in">
                        <h2>Sube las mejores fotos</h2>
                        <p className="text-muted">Las fotos de buena calidad venden más rápido.</p>

                        <div className="upload-area">
                            <Upload size={48} className="upload-icon" />
                            <h3>Arrastra y suelta tus fotos aquí</h3>
                            <p>o</p>
                            <button className="btn-secondary">Seleccionar Archivos</button>
                            <span className="upload-hint">Formatos soportados: JPG, PNG. Máx 5MB por foto.</span>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="form-step animate-slide-in">
                        <h2>Define el precio</h2>
                        <p className="text-muted">¿Cuánto esperas recibir por ella?</p>

                        <div className="form-group">
                            <label>Precio de Venta (COP)</label>
                            <div className="price-input-wrapper">
                                <span className="currency">$</span>
                                <input type="number" className="form-input price-input" placeholder="0" />
                            </div>
                        </div>

                        <div className="summary-box">
                            <p>Ten en cuenta que RIGOMARKET cobra una pequeña comisión por la transacción segura y logística técnica.</p>
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button className="btn-primary" onClick={handleNext}>
                        {step === 4 ? 'Publicar Mi Bici' : 'Siguiente Paso'} <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Vender;
