<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Ride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ride_id' => 'required|exists:rides,id',
            'seats_booked' => 'required|integer|min:1',
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
        $booking = Booking::create([
            'ride_id' => $request->ride_id,
            'passenger_id' => $request->user()->id,
            'seats_booked' => $request->seats_booked,
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Demande de réservation envoyée',
            'data' => $booking->load(['ride.driver', 'passenger'])
        ], 201);
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
        $booking->update(['status' => 'confirmed']);
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
        $booking->update(['status' => 'cancelled']);
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