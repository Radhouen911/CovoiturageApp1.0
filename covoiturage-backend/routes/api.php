<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RideController;
use App\Http\Controllers\Api\BookingController;


// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rides', [RideController::class, 'index']);
Route::get('/rides/{ride}', [RideController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

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
});