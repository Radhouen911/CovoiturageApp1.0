<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Booking;

class BookingRejectedNotification extends Notification
{
    use Queueable;

    protected $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $driver = $this->booking->ride->driver;
        $ride = $this->booking->ride;

        return [
            'type' => 'booking_rejected',
            'title' => 'Demande de réservation rejetée',
            'message' => "{$driver->name} a rejeté votre demande de réservation pour le trajet {$ride->from} → {$ride->to}",
            'booking_id' => $this->booking->id,
            'ride_id' => $ride->id,
            'driver_id' => $driver->id,
            'seats_booked' => $this->booking->seats_booked,
            'total_price' => $this->booking->total_price,
        ];
    }
}
