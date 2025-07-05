<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ride extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'from',
        'to',
        'date',
        'time',
        'price',
        'available_seats',
        'total_seats',
        'car',
        'description',
        'amenities',
        'status',
    ];

    protected $casts = [
        'amenities' => 'array',
        'date' => 'date',
        'time' => 'datetime',
        'price' => 'decimal:2',
    ];

    // Relationships
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // Helper methods
    public function getRemainingSeatsAttribute()
    {
        return $this->available_seats - $this->bookings()->where('status', 'confirmed')->sum('seats_booked');
    }

    public function isAvailable()
    {
        return $this->status === 'active' && $this->remaining_seats > 0;
    }
}