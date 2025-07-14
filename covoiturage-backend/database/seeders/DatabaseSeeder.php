<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ride;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users
        $driver = User::factory()->create([
            'name' => 'Jean Dupont',
            'email' => 'driver@example.com',
            'role' => 'driver',
            'phone' => '0123456789',
        ]);

        $passenger = User::factory()->create([
            'name' => 'Marie Martin',
            'email' => 'passenger@example.com',
            'role' => 'passenger',
            'phone' => '0987654321',
        ]);

        // Create sample rides
        Ride::create([
            'driver_id' => $driver->id,
            'from' => 'Paris',
            'to' => 'Lyon',
            'date' => now()->addDays(2)->format('Y-m-d'),
            'time' => '14:30',
            'price' => 25.00,
            'available_seats' => 3,
            'total_seats' => 4,
            'car' => 'Renault Clio',
            'description' => 'Trajet confortable avec climatisation',
            'amenities' => ['wifi', 'music', 'ac'],
            'status' => 'active',
        ]);

        Ride::create([
            'driver_id' => $driver->id,
            'from' => 'Marseille',
            'to' => 'Nice',
            'date' => now()->addDays(1)->format('Y-m-d'),
            'time' => '09:00',
            'price' => 15.00,
            'available_seats' => 2,
            'total_seats' => 3,
            'car' => 'Peugeot 208',
            'description' => 'Trajet rapide sur la côte d\'azur',
            'amenities' => ['wifi', 'ac'],
            'status' => 'active',
        ]);

        Ride::create([
            'driver_id' => $driver->id,
            'from' => 'Toulouse',
            'to' => 'Bordeaux',
            'date' => now()->addDays(3)->format('Y-m-d'),
            'time' => '16:00',
            'price' => 20.00,
            'available_seats' => 4,
            'total_seats' => 5,
            'car' => 'Citroën C3',
            'description' => 'Grande voiture pour un trajet agréable',
            'amenities' => ['wifi', 'music', 'ac', 'luggage'],
            'status' => 'active',
        ]);
    }
}
