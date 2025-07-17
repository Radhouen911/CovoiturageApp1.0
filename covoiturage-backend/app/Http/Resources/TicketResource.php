<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'ride_id' => $this->ride_id,
            'ride' => $this->ride ? [
                'id' => $this->ride->id,
                'from' => $this->ride->from,
                'to' => $this->ride->to,
            ] : null,
            'subject' => $this->subject,
            'description' => $this->description,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}