<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Ride;
use App\Models\PaymentLog;
use App\Notifications\BookingRequestNotification;
use App\Notifications\BookingAcceptedNotification;
use App\Notifications\BookingRejectedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class BookingController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey("sk_test_51Rimm7040hVDDm2bVrrmM3wBbXEEjxW3rGxsk6oSOilApqWV5kB1lNt83Z3hW1W9HURHbeUtjrcrfRrNDNbKjyQk0035Hpcymk"); // Updated with your secret key
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ride_id' => 'required|exists:rides,id',
            'seats_booked' => 'required|integer|min:1',
            'payment_method_id' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $ride = Ride::find($request->ride_id);
        if (!$ride->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'Trajet non disponible'
            ], 400);
        }
        if ($ride->remaining_seats < $request->seats_booked) {
            return response()->json([
                'success' => false,
                'message' => 'Pas assez de places disponibles'
            ], 400);
        }
        if ($ride->driver_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas réserver votre propre trajet'
            ], 400);
        }

        $totalPrice = $ride->price * $request->seats_booked;
        $paymentIntent = PaymentIntent::create([
            'amount' => $totalPrice * 100, // Convert to cents
            'currency' => 'usd',
            'payment_method' => $request->payment_method_id,
            'confirm' => true, // Immediate confirmation
            'automatic_payment_methods' => [
                'enabled' => true,
                'allow_redirects' => 'never', // Disable redirect-based methods
            ],
        ]);

        if ($paymentIntent->status === 'succeeded') {
            $booking = Booking::create([
                'ride_id' => $request->ride_id,
                'passenger_id' => $request->user()->id,
                'seats_booked' => $request->seats_booked,
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);

            // Log payment without card details
            PaymentLog::create([
                'booking_id' => $booking->id,
                'payment_intent_id' => $paymentIntent->id,
                'amount' => $totalPrice,
                'status' => 'succeeded',
                'created_at' => now(),
            ]);

            // Send notification to driver
            $driver = $ride->driver;
            $booking->load(['ride.driver', 'passenger']);
            $driver->notify(new BookingRequestNotification($booking));

            return response()->json([
                'success' => true,
                'message' => 'Demande de réservation envoyée',
                'data' => $booking->load(['ride.driver', 'passenger'])
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Paiement échoué: ' . $paymentIntent->last_payment_error->message
            ], 400);
        }
    }

    public function index(Request $request)
    {
        $bookings = $request->user()->passengerBookings()
            ->with('ride.driver')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    public function show($id)
    {
        $booking = Booking::with(['ride.driver', 'passenger'])->find($id);
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation introuvable'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation introuvable'
            ], 404);
        }
        if ($booking->passenger_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }
        if ($booking->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Réservation déjà annulée'
            ], 400);
        }

        // Note: We don't need to restore available_seats because:
        // - available_seats represents the total seats available for booking
        // - remaining_seats is calculated as available_seats - accepted_bookings
        // When a booking is cancelled, it's no longer 'accepted', so remaining_seats will automatically increase

        $booking->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée avec succès'
        ]);
    }

    public function accept(Request $request, $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation introuvable'
            ], 404);
        }
        if ($booking->ride->driver_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }
        if ($booking->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Demande déjà traitée'
            ], 400);
        }
        $ride = $booking->ride;
        if ($ride->remaining_seats < $booking->seats_booked) {
            return response()->json([
                'success' => false,
                'message' => 'Pas assez de places disponibles'
            ], 400);
        }

        // Update booking status to accepted
        $booking->update(['status' => 'accepted']);

        // Note: We don't update available_seats here because:
        // - available_seats represents the total seats available for booking
        // - remaining_seats is calculated as available_seats - accepted_bookings
        // This way the calculation remains consistent

        // Send notification to passenger
        $passenger = $booking->passenger;
        $booking->load(['ride.driver', 'passenger']);
        $passenger->notify(new BookingAcceptedNotification($booking));

        return response()->json([
            'success' => true,
            'message' => 'Demande acceptée',
            'data' => $booking->load(['ride.driver', 'passenger'])
        ]);
    }

    public function reject(Request $request, $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation introuvable'
            ], 404);
        }
        if ($booking->ride->driver_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }
        if ($booking->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Demande déjà traitée'
            ], 400);
        }

        // Update booking status to rejected
        $booking->update(['status' => 'rejected']);

        // Send notification to passenger
        $passenger = $booking->passenger;
        $booking->load(['ride.driver', 'passenger']);
        $passenger->notify(new BookingRejectedNotification($booking));

        return response()->json([
            'success' => true,
            'message' => 'Demande rejetée',
            'data' => $booking->load(['ride.driver', 'passenger'])
        ]);
    }

    public function getBookingRequests(Request $request)
    {
        try {
            if (!$request->user()) {
                \Log::error('getBookingRequests: User not authenticated');
                return response()->json(['success' => false, 'message' => 'Non authentifié'], 401);
            }
            if ($request->user()->role !== 'driver') {
                \Log::error('getBookingRequests: User is not a driver', ['user_id' => $request->user()->id]);
                return response()->json(['success' => false, 'message' => 'Seuls les conducteurs peuvent voir les demandes'], 403);
            }
            $bookings = Booking::whereHas('ride', function ($query) use ($request) {
                $query->where('driver_id', $request->user()->id);
            })
                ->where('status', 'pending')
                ->with(['ride.driver', 'passenger'])
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json([
                'success' => true,
                'data' => $bookings
            ]);
        } catch (\Exception $e) {
            \Log::error('getBookingRequests error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }
}
