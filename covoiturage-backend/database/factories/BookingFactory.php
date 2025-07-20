<?php

namespace Database\Factories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition()
    {
        return [
            'passenger_id' => \App\Models\User::factory()->passenger(), // Ensure a passenger user is created or exists
            'ride_id' => \App\Models\Ride::factory(), // Ensure a ride is created or exists
            'driver_id' => \App\Models\User::factory()->driver(), // Ensure a driver user is created or exists
            'seats_booked' => $this->faker->numberBetween(1, 3),
            'status' => $this->faker->randomElement(['pending', 'accepted', 'rejected', 'completed', 'cancelled']),
        ];
    }
}
