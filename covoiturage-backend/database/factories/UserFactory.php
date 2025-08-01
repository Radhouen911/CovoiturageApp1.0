<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // default password
            'remember_token' => Str::random(10),
            'role' => $this->faker->randomElement(['passenger', 'driver']), // Default role
            'phone' => $this->faker->unique()->phoneNumber(),
            'avatar' => null, // Default to no avatar
        ];
    }

    /**
     * Indicate that the user is a driver.
     */
    public function driver()
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'driver',
        ]);
    }

    /**
     * Indicate that the user is a passenger.
     */
    public function passenger()
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'passenger',
        ]);
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin()
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }
}
