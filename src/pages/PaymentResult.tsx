import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import './PaymentResult.css';

const PaymentResult: React.FC = () => {
  const reference = sessionStorage.getItem('wompiReference');
  const { subscription, loading } = useSubscription();

  const isThisPayment = subscription?.wompiReference === reference;

  useEffect(() => {
    if (isThisPayment && subscription?.status === 'active') {
      sessionStorage.removeItem('wompiReference');
    }
  }, [isThisPayment, subscription?.status]);

  // No payment reference in session
  if (!loading && !reference) {
    return (
      <div className="payment-result-page">
        <div className="payment-result-card animate-fade-in">
          <XCircle size={64} className="payment-icon payment-icon--error" />
          <h2>Pago no encontrado</h2>
          <p>No encontramos información de pago en esta sesión. Si acabas de pagar, revisa tu correo o intenta de nuevo.</p>
          <Link to="/precios" className="payment-btn">Ver planes</Link>
        </div>
      </div>
    );
  }

  // Waiting: still loading, or webhook hasn't fired yet
  if (loading || !isThisPayment || subscription?.status === 'pending') {
    return (
      <div className="payment-result-page">
        <div className="payment-result-card animate-fade-in">
          <div className="payment-spinner">
            <Loader size={48} className="spin-icon" />
          </div>
          <h2>Confirmando tu suscripción...</h2>
          <p>Esto puede tardar unos segundos. No cierres esta ventana.</p>
        </div>
      </div>
    );
  }

  // Success
  if (isThisPayment && subscription?.status === 'active') {
    const planName = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
    return (
      <div className="payment-result-page">
        <div className="payment-result-card animate-fade-in">
          <CheckCircle size={64} className="payment-icon payment-icon--success" />
          <h2>¡Suscripción activa!</h2>
          <p>
            Tu plan <strong>{planName}</strong> está activo. Ya puedes publicar tu bicicleta.
          </p>
          <Link to="/vender" className="payment-btn">Publicar ahora</Link>
        </div>
      </div>
    );
  }

  // Failed
  return (
    <div className="payment-result-page">
      <div className="payment-result-card animate-fade-in">
        <XCircle size={64} className="payment-icon payment-icon--error" />
        <h2>Pago rechazado</h2>
        <p>El pago no pudo completarse. No se realizó ningún cobro.</p>
        <Link to="/precios" className="payment-btn">Intentar de nuevo</Link>
      </div>
    </div>
  );
};

export default PaymentResult;
