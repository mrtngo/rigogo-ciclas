import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LISTING_PLANS } from '../constants/plans';
import type { ListingPlan } from '../constants/plans';
import './Pricing.css';

const FMT_COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const Pricing: React.FC = () => {
  return (
    <div className="pricing-page animate-fade-in">
      <section className="pricing-hero">
        <div className="container">
          <h1>Elige tu <span>plan</span></h1>
          <p>Publica tu bicicleta y llega a miles de ciclistas en Colombia. Sin complicaciones.</p>
        </div>
      </section>

      <section className="container pricing-grid">
        {LISTING_PLANS.map((plan, i) => (
          <div
            key={plan.id}
            className={`pricing-card${i === 1 ? ' pricing-card--featured' : ''}`}
          >
            <div className="pricing-card-header">
              {i === 1 && <span className="pricing-popular-badge">Más popular</span>}
              <h2>{plan.name}</h2>
              <div className="pricing-price">
                {plan.price === 0 ? (
                  'Gratis'
                ) : (
                  <>
                    {FMT_COP.format(plan.price)}
                    <span>/mes</span>
                  </>
                )}
              </div>
              <p className="pricing-exposure">Exposición: {plan.exposure}</p>
            </div>

            <div className="pricing-card-body">
              <ul className="pricing-features">
                {plan.features.map(f => (
                  <li key={f}>
                    <span className="pricing-check-icon"><Check size={14} /></span>
                    {f}
                  </li>
                ))}
                <li>
                  <span className="pricing-check-icon"><Check size={14} /></span>
                  {plan.durationDays} días de publicación
                </li>
              </ul>
              <Link
                to="/vender"
                state={{ plan: plan.id as ListingPlan }}
                className={`pricing-cta-btn${plan.price === 0 ? ' pricing-cta-btn--outline' : ''}`}
              >
                {plan.price === 0 ? 'Publicar gratis' : 'Empezar ahora'}
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="pricing-faq container">
        <h2>Preguntas frecuentes</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>¿Puedo cambiar de plan?</h3>
            <p>Sí. Puedes actualizar tu plan en cualquier momento al publicar una nueva bicicleta.</p>
          </div>
          <div className="faq-item">
            <h3>¿Cómo funciona el pago?</h3>
            <p>Los planes Sprinter y Contrarreloj se pagan mensualmente con tarjeta débito o crédito a través de Wompi, la pasarela de pagos más usada en Colombia.</p>
          </div>
          <div className="faq-item">
            <h3>¿Qué pasa si no vendo?</h3>
            <p>Puedes renovar tu publicación al vencimiento o cambiar a un plan con mayor exposición para atraer más compradores.</p>
          </div>
          <div className="faq-item">
            <h3>¿Es seguro el pago?</h3>
            <p>100%. Wompi es una empresa del Grupo Bancolombia, certificada y regulada por la Superfinanciera.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
