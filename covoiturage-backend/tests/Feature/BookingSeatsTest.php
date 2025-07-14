<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Ride;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BookingSeatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_available_seats_reduce_when_booking_is_accepted()
    {
        // Create a driver and passenger
        $driver = User::factory()->create(['role' => 'driver']);
        $passenger = User::factory()->create(['role' => 'passenger']);

        // Create a ride with 3 available seats
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

        // Verify initial state
        $this->assertEquals(3, $ride->available_seats);
        $this->assertEquals(3, $ride->remaining_seats);

        // Create a booking
        $booking = Booking::create([
            'ride_id' => $ride->id,
            'passenger_id' => $passenger->id,
            'seats_booked' => 1,
            'total_price' => 25.00,
            'status' => 'pending',
        ]);

        // Accept the booking
        $response = $this->actingAs($driver)->putJson("/api/bookings/{$booking->id}/accept");

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Refresh the ride model
        $ride->refresh();

        // Verify available_seats didn't change (it represents total seats available)
        $this->assertEquals(3, $ride->available_seats);
        // Verify remaining_seats was reduced (calculated as available_seats - accepted_bookings)
        $this->assertEquals(2, $ride->remaining_seats);

        // Verify booking status was updated
        $booking->refresh();
        $this->assertEquals('accepted', $booking->status);
    }

    public function test_available_seats_restore_when_accepted_booking_is_cancelled()
    {
        // Create a driver and passenger
        $driver = User::factory()->create(['role' => 'driver']);
        $passenger = User::factory()->create(['role' => 'passenger']);

        // Create a ride with 3 available seats
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

        // Create and accept a booking
        $booking = Booking::create([
            'ride_id' => $ride->id,
            'passenger_id' => $passenger->id,
            'seats_booked' => 1,
            'total_price' => 25.00,
            'status' => 'accepted',
        ]);

        // Verify state after booking is accepted
        $this->assertEquals(3, $ride->available_seats);
        $this->assertEquals(2, $ride->remaining_seats);

        // Cancel the booking
        $response = $this->actingAs($passenger)->putJson("/api/bookings/{$booking->id}/cancel");

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Refresh the ride model
        $ride->refresh();

        // Verify available_seats didn't change (it represents total seats available)
        $this->assertEquals(3, $ride->available_seats);
        // Verify remaining_seats was restored (no more accepted bookings)
        $this->assertEquals(3, $ride->remaining_seats);

        // Verify booking status was updated
        $booking->refresh();
        $this->assertEquals('cancelled', $booking->status);
    }

    public function test_cannot_accept_booking_if_not_enough_seats()
    {
        // Create a driver and passenger
        $driver = User::factory()->create(['role' => 'driver']);
        $passenger = User::factory()->create(['role' => 'passenger']);

        // Create a ride with 1 available seat
        $ride = Ride::create([
            'driver_id' => $driver->id,
            'from' => 'Paris',
            'to' => 'Lyon',
            'date' => now()->addDays(2)->format('Y-m-d'),
            'time' => '14:30',
            'price' => 25.00,
            'available_seats' => 1,
            'total_seats' => 4,
            'car' => 'Renault Clio',
            'status' => 'active',
        ]);

        // Create a booking for 2 seats
        $booking = Booking::create([
            'ride_id' => $ride->id,
            'passenger_id' => $passenger->id,
            'seats_booked' => 2,
            'total_price' => 50.00,
            'status' => 'pending',
        ]);

        // Try to accept the booking
        $response = $this->actingAs($driver)->putJson("/api/bookings/{$booking->id}/accept");

        $response->assertStatus(400);
        $response->assertJson(['success' => false]);
        $response->assertJson(['message' => 'Pas assez de places disponibles']);

        // Verify available seats were not changed
        $ride->refresh();
        $this->assertEquals(1, $ride->available_seats);
    }
}
