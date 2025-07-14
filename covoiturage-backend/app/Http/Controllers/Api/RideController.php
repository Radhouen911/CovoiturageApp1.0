<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RideController extends Controller
{
    public function index(Request $request)
{
    $query = Ride::with('driver')->where('status', 'active');

    // Debug: Log the raw query before filters
    \Log::info('Initial Ride Query: ' . $query->toSql());

    // Search filters
    if ($request->has('from')) {
        $query->where('from', 'like', '%' . $request->from . '%');
        \Log::info('Filter applied: from = ' . $request->from);
    }

    if ($request->has('to')) {
        $query->where('to', 'like', '%' . $request->to . '%');
        \Log::info('Filter applied: to = ' . $request->to);
    }

    if ($request->has('date')) {
        $query->whereDate('date', $request->date);
        \Log::info('Filter applied: date = ' . $request->date);
    }

    if ($request->has('seats')) {
        $query->where('available_seats', '>=', $request->seats);
        \Log::info('Filter applied: seats >= ' . $request->seats);
    }

    // Fallback to return all active rides if no filters
    $rides = $query->orderBy('date')->orderBy('time')->paginate(10);

    \Log::info('Final Ride Query Result Count: ' . $rides->count());

    return response()->json([
        'success' => true,
        'data' => $rides
    ]);
}

    public function store(Request $request)
    {
        // Check if user is a driver
        if (!$request->user()->isDriver()) {
            return response()->json([
                'success' => false,
                'message' => 'Only drivers can create rides'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'from' => 'required|string|max:255',
            'to' => 'required|string|max:255',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'price' => 'required|numeric|min:1',
            'available_seats' => 'required|integer|min:1|max:8',
            'car' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'amenities' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $ride = Ride::create([
            'driver_id' => $request->user()->id,
            'from' => $request->from,
            'to' => $request->to,
            'date' => $request->date,
            'time' => $request->time,
            'price' => $request->price,
            'available_seats' => $request->available_seats,
            'total_seats' => $request->available_seats,
            'car' => $request->car,
            'description' => $request->description,
            'amenities' => $request->amenities ?? [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ride created successfully',
            'data' => $ride->load('driver')
        ], 201);
    }

    public function show($id)
    {
        $ride = Ride::with(['driver', 'bookings.passenger'])->find($id);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ride
        ]);
    }

    public function myRides(Request $request)
    {
        $user = $request->user();
        
        if ($user->isDriver()) {
            $rides = $user->driverRides()->with('bookings.passenger')->orderBy('date', 'desc')->paginate(10);
        } else {
            $rides = $user->passengerBookings()->with('ride.driver')->orderBy('created_at', 'desc')->paginate(10);
        }

        return response()->json([
            'success' => true,
            'data' => $rides
        ]);
    }

    public function update(Request $request, $id)
    {
        $ride = Ride::find($id);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        // Check if user owns this ride
        if ($ride->driver_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'from' => 'sometimes|required|string|max:255',
            'to' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date|after_or_equal:today',
            'time' => 'sometimes|required|date_format:H:i',
            'price' => 'sometimes|required|numeric|min:1',
            'available_seats' => 'sometimes|required|integer|min:1|max:8',
            'car' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'amenities' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $ride->update($request->only([
            'from', 'to', 'date', 'time', 'price', 'available_seats', 
            'car', 'description', 'amenities'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Ride updated successfully',
            'data' => $ride->load('driver')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $ride = Ride::find($id);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        // Check if user owns this ride
        if ($ride->driver_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $ride->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Ride cancelled successfully'
        ]);
    }
}