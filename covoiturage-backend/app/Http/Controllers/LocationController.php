<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Ride;
use App\Models\Booking;

class LocationController extends Controller
{
    /**
     * Update user's current location
     */
    public function updateUserLocation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'timestamp' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid location data',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();

            // Update user's location
            $user->update([
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'last_location_update' => $request->timestamp
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Location updated successfully',
                'data' => [
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                    'timestamp' => $request->timestamp
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update location',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get nearby rides based on user's location
     */
    public function getNearbyRides(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
            'radius' => 'numeric|min:1|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid parameters',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $latitude = $request->lat;
            $longitude = $request->lng;
            $radius = $request->radius ?? 10; // Default 10km radius

            // Calculate bounding box for efficient querying
            $latDelta = $radius / 111.32; // 1 degree = 111.32 km
            $lngDelta = $radius / (111.32 * cos(deg2rad($latitude)));

            $minLat = $latitude - $latDelta;
            $maxLat = $latitude + $latDelta;
            $minLng = $longitude - $lngDelta;
            $maxLng = $longitude + $lngDelta;

            // Get rides within the bounding box
            $rides = Ride::where('status', 'active')
                ->where('departure_date', '>', now())
                ->whereBetween('pickup_latitude', [$minLat, $maxLat])
                ->whereBetween('pickup_longitude', [$minLng, $maxLng])
                ->with(['driver', 'pickupLocation', 'dropoffLocation'])
                ->get();

            // Calculate exact distances and filter by radius
            $nearbyRides = $rides->filter(function ($ride) use ($latitude, $longitude, $radius) {
                $distance = $this->calculateDistance(
                    $latitude, $longitude,
                    $ride->pickup_latitude, $ride->pickup_longitude
                );
                $ride->distance = round($distance, 2);
                return $distance <= $radius;
            })->sortBy('distance');

            return response()->json([
                'success' => true,
                'data' => $nearbyRides->values(),
                'count' => $nearbyRides->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get nearby rides',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update ride location (for drivers)
     */
    public function updateRideLocation(Request $request, $rideId)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'timestamp' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid location data',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            $ride = Ride::where('id', $rideId)
                ->where('driver_id', $user->id)
                ->first();

            if (!$ride) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ride not found or access denied'
                ], 404);
            }

            // Update ride's current location
            $ride->update([
                'current_latitude' => $request->latitude,
                'current_longitude' => $request->longitude,
                'last_location_update' => $request->timestamp
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Ride location updated successfully',
                'data' => [
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                    'timestamp' => $request->timestamp
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update ride location',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get driver's current location for a ride
     */
    public function getDriverLocation($rideId)
    {
        try {
            $user = Auth::user();

            // Check if user is a passenger on this ride
            $booking = Booking::where('ride_id', $rideId)
                ->where('passenger_id', $user->id)
                ->where('status', 'accepted')
                ->first();

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }

            $ride = Ride::find($rideId);
            if (!$ride) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ride not found'
                ], 404);
            }

            if (!$ride->current_latitude || !$ride->current_longitude) {
                return response()->json([
                    'success' => false,
                    'message' => 'Driver location not available'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'latitude' => $ride->current_latitude,
                    'longitude' => $ride->current_longitude,
                    'last_update' => $ride->last_location_update,
                    'driver_name' => $ride->driver->name
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get driver location',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate fare based on distance
     */
    public function calculateFare(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pickup.latitude' => 'required|numeric|between:-90,90',
            'pickup.longitude' => 'required|numeric|between:-180,180',
            'dropoff.latitude' => 'required|numeric|between:-90,90',
            'dropoff.longitude' => 'required|numeric|between:-180,180'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid coordinates',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $pickupLat = $request->input('pickup.latitude');
            $pickupLng = $request->input('pickup.longitude');
            $dropoffLat = $request->input('dropoff.latitude');
            $dropoffLng = $request->input('dropoff.longitude');

            // Calculate distance
            $distance = $this->calculateDistance($pickupLat, $pickupLng, $dropoffLat, $dropoffLng);

            // Calculate fare (example pricing: base fare + per km rate)
            $baseFare = 5.00; // Base fare in currency
            $perKmRate = 2.50; // Rate per kilometer
            $fare = $baseFare + ($distance * $perKmRate);

            // Get estimated travel time (rough calculation)
            $avgSpeed = 30; // km/h in city
            $travelTime = ($distance / $avgSpeed) * 60; // minutes

            return response()->json([
                'success' => true,
                'data' => [
                    'distance' => round($distance, 2),
                    'fare' => round($fare, 2),
                    'travel_time' => round($travelTime),
                    'base_fare' => $baseFare,
                    'per_km_rate' => $perKmRate
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to calculate fare',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate distance between two points using Haversine formula
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Earth's radius in kilometers

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
