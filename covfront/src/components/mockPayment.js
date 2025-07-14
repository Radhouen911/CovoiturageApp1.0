import { useState } from "react";
import ApiService from "../services/api";

const MockPayment = ({ bookingId, amount, onPaymentComplete }) => {
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const handlePayment = async () => {
    try {
      const intent = await ApiService.createPaymentIntent(bookingId);
      const confirmation = await ApiService.confirmPayment({
        payment_intent_id: intent.data.id,
        amount: amount || intent.data.amount,
      });
      setPaymentStatus(confirmation.data.status);
      if (onPaymentComplete) onPaymentComplete(confirmation.data.status);
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentStatus("failed");
      if (onPaymentComplete) onPaymentComplete("failed");
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>Payer avec paiement simulé</button>
      <p>Statut: {paymentStatus}</p>
    </div>
  );
};

export default MockPayment;
