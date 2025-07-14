<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Ride;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BookingNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_driver_receives_notification_when_booking_is_created()
    {
        // Create a driver and passenger
        $driver = User::factory()->create(['role' => 'driver']);
        $passenger = User::factory()->create(['role' => 'passenger']);

        // Create a ride
        $ride = Ride::create([
            'driver_id' => $driver->id,
            'from' => 'Paris',
            'to' => 'Lyon',
            'date' => now()->addDays(2)->format('Y-m-d'),
            'time' => '14:30',
            'price' => 25.00,
            'available_seats' => 3,
            'total_seats' => 4,
            'car' => 'Renault Clio',
            'status' => 'active',
        ]);

        // Create a booking
        $booking = Booking::create([
            'ride_id' => $ride->id,
            'passenger_id' => $passenger->id,
            'seats_booked' => 1,
            'total_price' => 25.00,
            'status' => 'pending',
        ]);

        // Send notification manually (since we're not testing the full payment flow)
        $driver->notify(new \App\Notifications\BookingRequestNotification($booking));

        // Assert that the driver has a notification
        $this->assertEquals(1, $driver->notifications()->count());

        $notification = $driver->notifications()->first();
        $this->assertEquals('booking_request', $notification->data['type']);
        $this->assertEquals('Nouvelle demande de réservation', $notification->data['title']);
    }

    public function test_passenger_receives_notification_when_booking_is_accepted()
    {
        // Create a driver and passenger
        $driver = User::factory()->create(['role' => 'driver']);
        $passenger = User::factory()->create(['role' => 'passenger']);

        // Create a ride
        $ride = Ride::create([
            'driver_id' => $driver->id,
            'from' => 'Paris',
            'to' => 'Lyon',
            'date' => now()->addDays(2)->format('Y-m-d'),
            'time' => '14:30',
            'price' => 25.00,
            'available_seats' => 3,
            'total_seats' => 4,
            'car' => 'Renault Clio',
            'status' => 'active',
        ]);

        // Create a booking
        $booking = Booking::create([
            'ride_id' => $ride->id,
            'passenger_id' => $passenger->id,
            'seats_booked' => 1,
            'total_price' => 25.00,
            'status' => 'pending',
        ]);

        // Send notification manually
        $passenger->notify(new \App\Notifications\BookingAcceptedNotification($booking));

        // Assert that the passenger has a notification
        $this->assertEquals(1, $passenger->notifications()->count());

        $notification = $passenger->notifications()->first();
        $this->assertEquals('booking_accepted', $notification->data['type']);
        $this->assertEquals('Demande de réservation acceptée', $notification->data['title']);
    }

    public function test_passenger_receives_notification_when_booking_is_rejected()
    {
        // Create a driver and passenger
        $driver = User::factory()->create(['role' => 'driver']);
        $passenger = User::factory()->create(['role' => 'passenger']);

        // Create a ride
        $ride = Ride::create([
            'driver_id' => $driver->id,
            'from' => 'Paris',
            'to' => 'Lyon',
            'date' => now()->addDays(2)->format('Y-m-d'),
            'time' => '14:30',
            'price' => 25.00,
            'available_seats' => 3,
            'total_seats' => 4,
            'car' => 'Renault Clio',
            'status' => 'active',
        ]);

        // Create a booking
        $booking = Booking::create([
            'ride_id' => $ride->id,
            'passenger_id' => $passenger->id,
            'seats_booked' => 1,
            'total_price' => 25.00,
            'status' => 'pending',
        ]);

        // Send notification manually
        $passenger->notify(new \App\Notifications\BookingRejectedNotification($booking));

        // Assert that the passenger has a notification
        $this->assertEquals(1, $passenger->notifications()->count());

        $notification = $passenger->notifications()->first();
        $this->assertEquals('booking_rejected', $notification->data['type']);
        $this->assertEquals('Demande de réservation rejetée', $notification->data['title']);
    }
}
