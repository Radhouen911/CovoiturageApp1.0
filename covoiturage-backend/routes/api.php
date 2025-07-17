<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RideController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\SSEController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\TicketController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rides', [RideController::class, 'index']);
Route::get('/rides/{ride}', [RideController::class, 'show']);

// Test route for SSE
Route::get('/test-sse', function () {
    return response()->json(['message' => 'SSE endpoint is accessible']);
});

// Stats route
Route::get('/stats', function () {
    return response()->json([
        'totalRides' => DB::table('rides')->count(),
        'totalUsers' => DB::table('users')->count(),
        'totalTrips' => DB::table('bookings')->count(),
    ]);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'update']);
    Route::post('/user/avatar', [AuthController::class, 'uploadAvatar']);
    Route::delete('/user/avatar', [AuthController::class, 'deleteAvatar']);

    // Ride routes
    Route::post('/rides', [RideController::class, 'store']);
    Route::get('/my-rides', [RideController::class, 'myRides']);
    Route::put('/rides/{ride}', [RideController::class, 'update']);
    Route::delete('/rides/{ride}', [RideController::class, 'destroy']);

    // Booking routes
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/booking-requests', [BookingController::class, 'getBookingRequests']);
    Route::put('/bookings/{booking}/accept', [BookingController::class, 'accept']);
    Route::put('/bookings/{booking}/reject', [BookingController::class, 'reject']);
    Route::put('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

    // Messaging routes
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
    Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'sendMessage']);

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // GPS and Location routes
    Route::post('/user/location', [LocationController::class, 'updateUserLocation']);
    Route::get('/rides/nearby', [LocationController::class, 'getNearbyRides']);
    Route::post('/rides/{rideId}/location', [LocationController::class, 'updateRideLocation']);
    Route::get('/rides/{rideId}/driver-location', [LocationController::class, 'getDriverLocation']);
    Route::post('/calculate-fare', [LocationController::class, 'calculateFare']);

    // Payment routes
    Route::post('/payments/create-intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/payments/confirm', [PaymentController::class, 'confirmPayment']);
    Route::get('/payments/history', [PaymentController::class, 'getPaymentHistory']);
    Route::get('/payments/{paymentId}', [PaymentController::class, 'getPaymentDetails']);
    Route::post('/payments/refund', [PaymentController::class, 'requestRefund']);

    // SSE for real-time messaging
    Route::get('/sse/conversations/{conversationId}', [SSEController::class, 'stream']);

    // Ticket routes
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::put('/tickets/{id}', [TicketController::class, 'update']);
});