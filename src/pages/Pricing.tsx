import React, { useState } from 'react';
import { Check, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import { LISTING_PLANS } from '../constants/plans';
import type { ListingPlan } from '../constants/plans';
import { functions } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import './Pricing.css';

const FMT_COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paying, setPaying] = useState<ListingPlan | null>(null);
  const [payError, setPayError] = useState('');

  const handlePaidPlan = async (plan: ListingPlan) => {
    if (!user) {
      navigate('/login', { state: { from: '/precios' } });
      return;
    }
    setPaying(plan);
    setPayError('');
    try {
      const createCheckout = httpsCallable<
        { plan: string },
        { checkoutUrl: string; reference: string }
      >(functions, 'createWompiCheckout');
      const result = await createCheckout({ plan });
      const { checkoutUrl, reference } = result.data;
      sessionStorage.setItem('wompiReference', reference);
      window.location.href = checkoutUrl;
    } catch {
      setPayError('Error al iniciar el pago. Intenta de nuevo.');
      setPaying(null);
    }
  };

  return (
    <div className="pricing-page animate-fade-in">
      <section className="pricing-hero">
        <div className="container">
          <h1>Elige tu <span>plan</span></h1>
          <p>Suscríbete y publica tu bicicleta ante miles de ciclistas en Colombia.</p>
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

              {plan.price === 0 ? (
                <Link to="/vender" className="pricing-cta-btn pricing-cta-btn--outline">
                  Publicar gratis
                </Link>
              ) : (
                <button
                  className="pricing-cta-btn"
                  onClick={() => handlePaidPlan(plan.id)}
                  disabled={paying !== null}
                >
                  {paying === plan.id ? (
                    <><Loader size={16} className="pricing-spin" /> Iniciando pago...</>
                  ) : (
                    'Suscribirme'
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {payError && (
        <p className="container pricing-pay-error">{payError}</p>
      )}

      <section className="pricing-faq container">
        <h2>Preguntas frecuentes</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>¿Puedo cambiar de plan?</h3>
            <p>Sí. Puedes suscribirte a un plan diferente en cualquier momento.</p>
          </div>
          <div className="faq-item">
            <h3>¿Cómo funciona el pago?</h3>
            <p>Los planes Sprinter y Contrarreloj se pagan mensualmente con tarjeta débito o crédito a través de Wompi, la pasarela de pagos más usada en Colombia.</p>
          </div>
          <div className="faq-item">
            <h3>¿Qué pasa si no vendo?</h3>
            <p>Puedes renovar tu suscripción al vencimiento o cambiar a un plan con mayor exposición.</p>
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
