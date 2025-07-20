<?php

namespace Database\Factories;

use App\Models\Ride;
use Illuminate\Database\Eloquent\Factories\Factory;

class RideFactory extends Factory
{
    protected $model = Ride::class;

    public function definition()
    {
        return [
            'driver_id' => \App\Models\User::factory()->driver(), // Ensure a driver user is created or exists
            'origin' => $this->faker->address(),
            'destination' => $this->faker->address(),
            'departure_time' => $this->faker->dateTimeBetween('now', '+1 month'),
            'available_seats' => $this->faker->numberBetween(1, 4),
            'price' => $this->faker->randomFloat(2, 5, 100),
            'status' => $this->faker->randomElement(['active', 'completed', 'cancelled']),
        ];
    }
}
