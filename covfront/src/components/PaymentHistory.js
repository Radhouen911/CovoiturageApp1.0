import React, { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundLoading, setRefundLoading] = useState(false);

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await paymentService.getPaymentHistory();
      if (response.success) {
        setPayments(response.data.data || []);
      } else {
        setError(response.message || 'Failed to load payment history');
      }
    } catch (error) {
      console.error('Error loading payment history:', error);
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = async () => {
    if (!selectedPayment || !refundReason.trim()) {
      return;
    }

    try {
      setRefundLoading(true);
      const response = await paymentService.requestRefund(selectedPayment.id, refundReason);
      if (response.success) {
        setShowRefundModal(false);
        setRefundReason('');
        setSelectedPayment(null);
        loadPaymentHistory(); // Reload to show updated status
        alert('Refund request submitted successfully');
      } else {
        alert(response.message || 'Failed to submit refund request');
      }
    } catch (error) {
      console.error('Error requesting refund:', error);
      alert('Failed to submit refund request');
    } finally {
      setRefundLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement de l'historique des paiements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="payment-history">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <i className="fas fa-history text-primary me-2"></i>
          Historique des paiements
        </h4>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={loadPaymentHistory}
        >
          <i className="fas fa-sync-alt me-1"></i>
          Actualiser
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-credit-card fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">Aucun paiement trouvé</h5>
          <p className="text-muted">Vous n'avez pas encore effectué de paiements.</p>
        </div>
      ) : (
        <div className="row">
          {payments.map((payment) => (
            <div key={payment.id} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <div className="d-flex align-items-center">
                        <div className={`badge bg-${paymentService.getStatusColor(payment.status)} me-2`}>
                          {paymentService.getStatusText(payment.status)}
                        </div>
                        <small className="text-muted">
                          {formatDate(payment.created_at)}
                        </small>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <h6 className="mb-1">
                        {payment.booking?.ride?.from} → {payment.booking?.ride?.to}
                      </h6>
                      <small className="text-muted">
                        {payment.booking?.seats_booked} place(s) • {formatDate(payment.booking?.ride?.date)}
                      </small>
                    </div>
                    
                    <div className="col-md-2 text-center">
                      <h5 className="text-primary mb-0">
                        {paymentService.formatAmount(payment.amount, payment.currency)}
                      </h5>
                    </div>
                    
                    <div className="col-md-3 text-end">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() => setSelectedPayment(payment)}
                          title="Voir les détails"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        
                        {payment.status === 'succeeded' && (
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowRefundModal(true);
                            }}
                            title="Demander un remboursement"
                          >
                            <i className="fas fa-undo"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && !showRefundModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails du paiement</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedPayment(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>ID Paiement:</strong> {selectedPayment.id}</p>
                    <p><strong>Montant:</strong> {paymentService.formatAmount(selectedPayment.amount, selectedPayment.currency)}</p>
                    <p><strong>Statut:</strong> 
                      <span className={`badge bg-${paymentService.getStatusColor(selectedPayment.status)} ms-2`}>
                        {paymentService.getStatusText(selectedPayment.status)}
                      </span>
                    </p>
                    <p><strong>Méthode:</strong> {selectedPayment.payment_method}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Date:</strong> {formatDate(selectedPayment.created_at)}</p>
                    {selectedPayment.processed_at && (
                      <p><strong>Traité le:</strong> {formatDate(selectedPayment.processed_at)}</p>
                    )}
                    <p><strong>Description:</strong> {selectedPayment.description}</p>
                  </div>
                </div>
                
                {selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0 && (
                  <div className="mt-3">
                    <h6>Métadonnées:</h6>
                    <pre className="bg-light p-2 rounded">
                      {JSON.stringify(selectedPayment.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedPayment(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Demande de remboursement</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundReason('');
                  }}
                  disabled={refundLoading}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Vous êtes sur le point de demander un remboursement pour le paiement de{' '}
                  <strong>{paymentService.formatAmount(selectedPayment.amount, selectedPayment.currency)}</strong>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Raison du remboursement *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Veuillez expliquer la raison de votre demande de remboursement..."
                    disabled={refundLoading}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundReason('');
                  }}
                  disabled={refundLoading}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleRefundRequest}
                  disabled={refundLoading || !refundReason.trim()}
                >
                  {refundLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Envoi...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-undo me-2"></i>
                      Demander le remboursement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .payment-history .card {
          border: 1px solid #dee2e6;
          transition: box-shadow 0.3s ease;
        }
        
        .payment-history .card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .badge {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default PaymentHistory; 