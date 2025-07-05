<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'ride_id',
        'passenger_id',
        'seats_booked',
        'status',
        'total_price',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    // Relationships
    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }

    public function passenger()
    {
        return $this->belongsTo(User::class, 'passenger_id');
    }
}