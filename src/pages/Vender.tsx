import React from 'react';
import { Camera, Tag, ShieldCheck, CreditCard } from 'lucide-react';
import './Vender.css';

const Vender: React.FC = () => {
    return (
        <div className="vender-page animate-fade-in">
            <section className="vender-hero">
                <div className="container">
                    <h1>Vende tu bici en <span className="highlight">minutos</span></h1>
                    <p>Llega a miles de ciclistas apasionados. Es rápido, seguro y fácil.</p>
                    <button className="btn-primary" style={{ marginTop: '2rem' }}>Empezar a Vender</button>
                </div>
            </section>

            <section className="container vender-steps">
                <div className="step-card">
                    <div className="step-icon"><Camera size={32} /></div>
                    <h3>1. Sube fotos</h3>
                    <p>Toma fotos reales de tu bicicleta, componentes y cualquier detalle importante.</p>
                </div>
                <div className="step-card">
                    <div className="step-icon"><Tag size={32} /></div>
                    <h3>2. Pon un precio</h3>
                    <p>Te ayudamos a tasar tu bici según el mercado actual y el estado de la misma.</p>
                </div>
                <div className="step-card">
                    <div className="step-icon"><ShieldCheck size={32} /></div>
                    <h3>3. Verificación</h3>
                    <p>Validamos los datos para dar confianza a los posibles compradores.</p>
                </div>
                <div className="step-card">
                    <div className="step-icon"><CreditCard size={32} /></div>
                    <h3>4. Recibe tu dinero</h3>
                    <p>Transferencia segura una vez el comprador reciba su nueva máquina.</p>
                </div>
            </section>
        </div>
    );
};

export default Vender;
