<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Booking;
use App\Models\Payment;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a payment intent for a booking
     */
    public function createPaymentIntent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid booking',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            $booking = Booking::where('id', $request->booking_id)
                ->where('passenger_id', $user->id)
                ->first();

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found or access denied'
                ], 404);
            }

            if ($booking->isPaid()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking is already paid'
                ], 400);
            }

            // Create payment record
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $user->id,
                'amount' => $booking->total_price,
                'currency' => Payment::CURRENCY_TND,
                'payment_method' => Payment::METHOD_CARD,
                'status' => Payment::STATUS_PENDING,
                'description' => "Payment for ride from {$booking->ride->from} to {$booking->ride->to}",
                'metadata' => [
                    'ride_id' => $booking->ride_id,
                    'seats_booked' => $booking->seats_booked,
                    'ride_date' => $booking->ride->date,
                ]
            ]);

            // Create Stripe Payment Intent
            $paymentIntent = PaymentIntent::create([
                'amount' => (int)($booking->total_price * 100), // Convert to cents
                'currency' => strtolower($payment->currency),
                'metadata' => [
                    'payment_id' => $payment->id,
                    'booking_id' => $booking->id,
                    'user_id' => $user->id,
                ],
                'description' => $payment->description,
            ]);

            // Update payment with Stripe Payment Intent ID
            $payment->update([
                'stripe_payment_intent_id' => $paymentIntent->id,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'client_secret' => $paymentIntent->client_secret,
                    'payment_id' => $payment->id,
                    'amount' => $payment->amount,
                    'currency' => $payment->currency,
                ]
            ]);

        } catch (ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment processing error',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm payment completion
     */
    public function confirmPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_id' => 'required|exists:payments,id',
            'payment_intent_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment data',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            $payment = Payment::where('id', $request->payment_id)
                ->where('user_id', $user->id)
                ->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found or access denied'
                ], 404);
            }

            // Verify payment intent with Stripe
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            if ($paymentIntent->status === 'succeeded') {
                // Update payment status
                $payment->update([
                    'status' => Payment::STATUS_SUCCEEDED,
                    'stripe_charge_id' => $paymentIntent->latest_charge,
                    'processed_at' => now(),
                ]);

                // Update booking payment status
                $payment->booking->update([
                    'payment_status' => Booking::PAYMENT_STATUS_PAID,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment completed successfully',
                    'data' => [
                        'payment_id' => $payment->id,
                        'status' => $payment->status,
                        'amount' => $payment->amount,
                        'booking_id' => $payment->booking_id,
                    ]
                ]);
            } else {
                // Update payment status to failed
                $payment->update([
                    'status' => Payment::STATUS_FAILED,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Payment failed',
                    'data' => [
                        'payment_id' => $payment->id,
                        'status' => $payment->status,
                    ]
                ], 400);
            }

        } catch (ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification error',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment history for user
     */
    public function getPaymentHistory(Request $request)
    {
        try {
            $user = Auth::user();
            $payments = Payment::where('user_id', $user->id)
                ->with(['booking.ride'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $payments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payment history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment details
     */
    public function getPaymentDetails($paymentId)
    {
        try {
            $user = Auth::user();
            $payment = Payment::where('id', $paymentId)
                ->where('user_id', $user->id)
                ->with(['booking.ride', 'booking.passenger'])
                ->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found or access denied'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payment details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Request refund for a payment
     */
    public function requestRefund(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_id' => 'required|exists:payments,id',
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid refund request',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            $payment = Payment::where('id', $request->payment_id)
                ->where('user_id', $user->id)
                ->where('status', Payment::STATUS_SUCCEEDED)
                ->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found or not eligible for refund'
                ], 404);
            }

            // Update payment status to refunded
            $payment->update([
                'status' => Payment::STATUS_REFUNDED,
                'metadata' => array_merge($payment->metadata ?? [], [
                    'refund_reason' => $request->reason,
                    'refunded_at' => now()->toISOString(),
                ])
            ]);

            // Update booking payment status
            $payment->booking->update([
                'payment_status' => Booking::PAYMENT_STATUS_REFUNDED,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Refund request submitted successfully',
                'data' => [
                    'payment_id' => $payment->id,
                    'status' => $payment->status,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process refund request',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
