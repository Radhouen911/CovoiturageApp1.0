import ApiService from './api';

class PaymentService {
  constructor() {
    this.stripe = null;
    this.elements = null;
    this.cardElement = null;
    this.initializeStripe();
  }

  // Initialize Stripe
  async initializeStripe() {
    try {
      // Load Stripe script if not already loaded
      if (!window.Stripe) {
        await this.loadStripeScript();
      }
      
      // Initialize Stripe with your publishable key
      this.stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key');
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  }

  // Load Stripe script
  loadStripeScript() {
    return new Promise((resolve, reject) => {
      if (window.Stripe) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Stripe'));
      document.head.appendChild(script);
    });
  }

  // Create payment intent
  async createPaymentIntent(bookingId) {
    try {
      const response = await ApiService.createPaymentIntent(bookingId);
      return response;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Process payment with Stripe
  async processPayment(paymentIntentData, cardElement) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        paymentIntentData.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Passenger Name', // You can get this from user data
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const confirmResponse = await ApiService.confirmPayment({
          payment_id: paymentIntentData.payment_id,
          payment_intent_id: paymentIntent.id,
        });

        return {
          success: true,
          paymentIntent,
          confirmation: confirmResponse,
        };
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory() {
    try {
      const response = await ApiService.getPaymentHistory();
      return response;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    try {
      const response = await ApiService.getPaymentDetails(paymentId);
      return response;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  }

  // Request refund
  async requestRefund(paymentId, reason) {
    try {
      const response = await ApiService.requestRefund(paymentId, reason);
      return response;
    } catch (error) {
      console.error('Error requesting refund:', error);
      throw error;
    }
  }

  // Format amount for display
  formatAmount(amount, currency = 'TND') {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Get payment status color
  getStatusColor(status) {
    const colors = {
      pending: 'warning',
      processing: 'info',
      succeeded: 'success',
      failed: 'danger',
      cancelled: 'secondary',
      refunded: 'info',
    };
    return colors[status] || 'secondary';
  }

  // Get payment status text
  getStatusText(status) {
    const texts = {
      pending: 'En attente',
      processing: 'En cours',
      succeeded: 'Payé',
      failed: 'Échoué',
      cancelled: 'Annulé',
      refunded: 'Remboursé',
    };
    return texts[status] || status;
  }

  // Validate card number (basic validation)
  validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return cleanNumber.length >= 13 && cleanNumber.length <= 19;
  }

  // Validate expiry date
  validateExpiryDate(expiryDate) {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }

    return expMonth >= 1 && expMonth <= 12;
  }

  // Validate CVC
  validateCVC(cvc) {
    return cvc.length >= 3 && cvc.length <= 4;
  }
}

export default new PaymentService(); 