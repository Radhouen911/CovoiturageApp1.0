import React, { useState, useEffect, useRef } from 'react';
import paymentService from '../services/paymentService';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isOpen && booking) {
      initializePayment();
    }
  }, [isOpen, booking]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Create payment intent
      const response = await paymentService.createPaymentIntent(booking.id);
      if (response.success) {
        setPaymentIntent(response.data);
        
        // Initialize Stripe Elements
        if (paymentService.stripe && cardRef.current) {
          const elements = paymentService.stripe.elements();
          const card = elements.create('card', {
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          });
          
          card.mount(cardRef.current);
          setCardElement(card);
        }
      } else {
        setError(response.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError(error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cardElement || !paymentIntent) {
      setError('Payment not initialized');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result = await paymentService.processPayment(paymentIntent, cardElement);
      
      if (result.success) {
        onPaymentSuccess(result);
        onClose();
      } else {
        setError('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed');
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (cardElement) {
      cardElement.destroy();
      setCardElement(null);
    }
    setPaymentIntent(null);
    setError('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-credit-card text-primary me-2"></i>
              Paiement sécurisé
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={loading}
            ></button>
          </div>
          
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {booking && (
              <div className="booking-summary mb-4">
                <h6>Résumé de la réservation</h6>
                <div className="card bg-light">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Trajet:</strong> {booking.ride?.from} → {booking.ride?.to}</p>
                        <p><strong>Date:</strong> {new Date(booking.ride?.date).toLocaleDateString('fr-FR')}</p>
                        <p><strong>Places:</strong> {booking.seats_booked}</p>
                      </div>
                      <div className="col-md-6 text-end">
                        <h4 className="text-primary mb-0">
                          {paymentService.formatAmount(booking.total_price)}
                        </h4>
                        <small className="text-muted">Total à payer</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentIntent && (
              <div className="payment-form">
                <h6>Informations de paiement</h6>
                <div className="mb-3">
                  <label className="form-label">Numéro de carte</label>
                  <div 
                    ref={cardRef}
                    className="form-control"
                    style={{ height: '40px', padding: '10px' }}
                  ></div>
                  <small className="text-muted">
                    <i className="fas fa-lock me-1"></i>
                    Vos informations de paiement sont sécurisées par Stripe
                  </small>
                </div>

                <div className="payment-methods mb-3">
                  <small className="text-muted">Méthodes de paiement acceptées:</small>
                  <div className="mt-2">
                    <i className="fab fa-cc-visa fa-2x me-2 text-primary"></i>
                    <i className="fab fa-cc-mastercard fa-2x me-2 text-warning"></i>
                    <i className="fab fa-cc-amex fa-2x me-2 text-info"></i>
                    <i className="fab fa-cc-paypal fa-2x me-2 text-primary"></i>
                  </div>
                </div>

                <div className="security-info">
                  <div className="alert alert-info">
                    <i className="fas fa-shield-alt me-2"></i>
                    <strong>Sécurité:</strong> Votre paiement est protégé par un cryptage SSL 256-bit
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Traitement...</span>
                </div>
                <p className="mt-2">Traitement du paiement en cours...</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePayment}
              disabled={loading || !cardElement || !paymentIntent}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Traitement...
                </>
              ) : (
                <>
                  <i className="fas fa-lock me-2"></i>
                  Payer {booking && paymentService.formatAmount(booking.total_price)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal-dialog {
          max-width: 600px;
        }
        
        .booking-summary .card {
          border: 1px solid #dee2e6;
        }
        
        .payment-form .form-control {
          border: 1px solid #ced4da;
          border-radius: 0.375rem;
        }
        
        .payment-methods i {
          opacity: 0.7;
        }
        
        .security-info .alert {
          border-left: 4px solid #17a2b8;
        }
      `}</style>
    </div>
  );
};

export default PaymentModal; 