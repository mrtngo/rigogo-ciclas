import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useListingByReference } from '../hooks/useListingByReference';
import './PaymentResult.css';

const PaymentResult: React.FC = () => {
  const reference = sessionStorage.getItem('wompiReference');
  const { listing, loading } = useListingByReference(reference);

  // Clean up sessionStorage once confirmed active
  useEffect(() => {
    if (listing?.status === 'active') {
      sessionStorage.removeItem('wompiReference');
    }
  }, [listing?.status]);

  // No reference in sessionStorage — direct navigation or session lost
  if (!loading && !reference) {
    return (
      <div className="payment-result-page">
        <div className="payment-result-card animate-fade-in">
          <XCircle size={64} className="payment-icon payment-icon--error" />
          <h2>Pago no encontrado</h2>
          <p>No encontramos información de pago en esta sesión. Si acabas de pagar, revisa tu email o intenta de nuevo.</p>
          <Link to="/vender" className="payment-btn">Volver a publicar</Link>
        </div>
      </div>
    );
  }

  // Loading initial query OR waiting for webhook to flip status to active
  if (loading || listing?.status === 'draft' || listing?.status === 'pending') {
    return (
      <div className="payment-result-page">
        <div className="payment-result-card animate-fade-in">
          <div className="payment-spinner">
            <Loader size={48} className="spin-icon" />
          </div>
          <h2>Confirmando tu pago...</h2>
          <p>Esto puede tardar unos segundos. No cierres esta ventana.</p>
        </div>
      </div>
    );
  }

  // Success
  if (listing?.status === 'active') {
    return (
      <div className="payment-result-page">
        <div className="payment-result-card animate-fade-in">
          <CheckCircle size={64} className="payment-icon payment-icon--success" />
          <h2>¡Pago exitoso!</h2>
          <p>
            Tu <strong>{listing.brand} {listing.model}</strong> ya está publicada y visible en el catálogo.
          </p>
          <Link to="/marketplace" className="payment-btn">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  // Error (rejected / not found)
  return (
    <div className="payment-result-page">
      <div className="payment-result-card animate-fade-in">
        <XCircle size={64} className="payment-icon payment-icon--error" />
        <h2>Pago rechazado</h2>
        <p>El pago no pudo completarse. No se realizó ningún cobro. Puedes intentarlo de nuevo.</p>
        <Link to="/vender" className="payment-btn">Intentar de nuevo</Link>
      </div>
    </div>
  );
};

export default PaymentResult;
