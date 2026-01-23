import React from 'react';
import './Home.css';
import { ArrowRight, CheckCircle, Shield, Truck } from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page animate-fade-in">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <div className="hero-text">
                        <span className="badge">Nuevas & Usadas</span>
                        <h1>Encuentra tu bici ideal con el sello de <span className="highlight">Rigo</span></h1>
                        <p>La comunidad más grande de ciclistas en Colombia. Compra y vende con total seguridad y confianza.</p>
                        <div className="hero-actions">
                            <button className="btn-primary" onClick={() => navigate('/marketplace')}>
                                Ver Bicicletas <ArrowRight size={20} />
                            </button>
                            <Link to="/vender" className="btn-outline">Vender mi Bici</Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        {/* Placeholder for hero image - usually a high quality photo of a bike or Rigo */}
                        <div className="image-placeholder">
                            <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1600&auto=format&fit=crop" alt="Specialized Bike" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features container">
                <div className="feature-card">
                    <Shield className="feature-icon" />
                    <h3>Compra Segura</h3>
                    <p>Verificamos cada bicicleta y aseguramos tu pago hasta que recibas el producto.</p>
                </div>
                <div className="feature-card">
                    <Truck className="feature-icon" />
                    <h3>Envío a Todo el País</h3>
                    <p>Nos encargamos de la logística para que tu nueva bici llegue a la puerta de tu casa.</p>
                </div>
                <div className="feature-card">
                    <CheckCircle className="feature-icon" />
                    <h3>Certificadas</h3>
                    <p>Bicicletas inspeccionadas por mecánicos expertos apasionados por el ciclismo.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
