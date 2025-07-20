<?php

namespace Database\Factories;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition()
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'type' => $this->faker->randomElement(['ride_request', 'booking_completed', 'ticket_update', 'payment', 'driver_registration']),
            'message' => $this->faker->sentence(),
            'read_at' => $this->faker->boolean(70) ? now() : null, // 70% chance of being read
        ];
    }
}
