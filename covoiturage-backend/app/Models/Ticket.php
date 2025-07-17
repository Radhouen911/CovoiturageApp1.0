<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = ['user_id', 'ride_id', 'subject', 'description', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }
}