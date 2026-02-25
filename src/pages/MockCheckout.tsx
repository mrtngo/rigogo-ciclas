import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, CreditCard, Lock } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { LISTING_PLANS } from '../constants/plans';
import type { ListingPlan } from '../constants/plans';
import { LOGOS } from '../constants/assets';
import './MockCheckout.css';

const FMT_COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function formatCard(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}
function formatExpiry(val: string) {
  const d = val.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

const MockCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const plan = (location.state as { plan?: ListingPlan } | null)?.plan;
  const planConfig = LISTING_PLANS.find(p => p.id === plan);

  const [stage, setStage] = useState<'form' | 'processing' | 'success'>('form');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  if (!plan || !planConfig || planConfig.price === 0) {
    return <Navigate to="/precios" replace />;
  }

  const isFormValid = cardName.trim().length > 2
    && cardNumber.replace(/\s/g, '').length === 16
    && expiry.length === 5
    && cvv.length === 3;

  const handlePay = async () => {
    if (!user) return;
    setStage('processing');

    // Simulate network delay
    await new Promise(r => setTimeout(r, 2000));

    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + (plan === 'contrarreloj' ? 60 : 30));

    await setDoc(doc(db, 'subscriptions', user.uid), {
      plan,
      status: 'active',
      wompiReference: `MOCK-${Date.now()}`,
      periodEnd,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    setStage('success');
  };

  if (stage === 'processing') {
    return (
      <div className="mco-page">
        <div className="mco-single-card animate-fade-in">
          <div className="mco-spinner" />
          <h2>Procesando pago...</h2>
          <p>No cierres esta ventana.</p>
        </div>
      </div>
    );
  }

  if (stage === 'success') {
    return (
      <div className="mco-page">
        <div className="mco-single-card animate-fade-in">
          <CheckCircle size={64} className="mco-success-icon" />
          <h2>¡Suscripción activa!</h2>
          <p>Tu plan <strong>{planConfig.name}</strong> está listo. Ya puedes publicar tu bicicleta.</p>
          <button className="mco-pay-btn" onClick={() => navigate('/vender')}>
            Publicar ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mco-page">
      <div className="mco-layout animate-fade-in">

        {/* ── Left: order summary ── */}
        <div className="mco-summary">
          <img src={LOGOS.blanco} alt="rigomarket" className="mco-logo" />

          <div className="mco-plan-block">
            <p className="mco-plan-label">Plan seleccionado</p>
            <h2>{planConfig.name}</h2>
            <p className="mco-plan-meta">
              {planConfig.durationDays} días · hasta {planConfig.maxPhotos} fotos · exposición {planConfig.exposure}
            </p>
          </div>

          <div className="mco-total">
            <span>Total hoy</span>
            <strong>{FMT_COP.format(planConfig.price)}</strong>
          </div>

          <p className="mco-secure"><Lock size={13} /> Pago seguro simulado</p>
        </div>

        {/* ── Right: payment form ── */}
        <div className="mco-form">
          <h3><CreditCard size={18} /> Datos de pago</h3>
          <div className="mco-test-hint">
            Modo de prueba — usa la tarjeta <strong>4242 4242 4242 4242</strong>
          </div>

          <div className="mco-field">
            <label>Nombre en la tarjeta</label>
            <input
              className="mco-input"
              type="text"
              placeholder="Juan Pérez"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
            />
          </div>

          <div className="mco-field">
            <label>Número de tarjeta</label>
            <input
              className="mco-input"
              type="text"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={e => setCardNumber(formatCard(e.target.value))}
            />
          </div>

          <div className="mco-row">
            <div className="mco-field">
              <label>Vencimiento</label>
              <input
                className="mco-input"
                type="text"
                placeholder="MM/AA"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
              />
            </div>
            <div className="mco-field">
              <label>CVV</label>
              <input
                className="mco-input"
                type="text"
                placeholder="123"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
              />
            </div>
          </div>

          <button
            className="mco-pay-btn"
            onClick={handlePay}
            disabled={!isFormValid}
          >
            Pagar {FMT_COP.format(planConfig.price)}
          </button>

          <Link to="/precios" className="mco-cancel">Cancelar y volver</Link>
        </div>
      </div>
    </div>
  );
};

export default MockCheckout;
