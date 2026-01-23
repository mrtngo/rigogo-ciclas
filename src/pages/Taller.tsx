import React from 'react';
import { Wrench, Calendar, MapPin, Gauge } from 'lucide-react';
import './Taller.css';

const Taller: React.FC = () => {
    return (
        <div className="taller-page animate-fade-in">
            <section className="taller-header container">
                <div className="taller-content">
                    <span className="badge">Servicio Técnico VIP</span>
                    <h1>Tu bici en manos de <span className="highlight">Expertos</span></h1>
                    <p>Mantenimiento preventivo, reparaciones especializadas y puesta a punto profesional.</p>
                    <button className="btn-primary"><Calendar size={18} /> Agendar Cita</button>
                </div>
                <div className="taller-visual">
                    <img src="https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=1000" alt="Taller Mecanico" />
                </div>
            </section>

            <section className="services container">
                <div className="service-item">
                    <div className="service-icon"><Wrench /></div>
                    <div>
                        <h4>Mantenimiento Gold</h4>
                        <p>Desensamble completo, limpieza por ultrasonido y engrase premium.</p>
                    </div>
                </div>
                <div className="service-item">
                    <div className="service-icon"><Gauge /></div>
                    <div>
                        <h4>Puesta a Punto</h4>
                        <p>Ajuste de cambios, frenos y lubricación completa.</p>
                    </div>
                </div>
                <div className="service-item">
                    <div className="service-icon"><MapPin /></div>
                    <div>
                        <h4>Ubicaciones</h4>
                        <p>Nuestros talleres aliados están en todo el país (Medellín, Bogotá, Cali).</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Taller;
