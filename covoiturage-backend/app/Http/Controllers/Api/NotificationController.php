<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Auth::user()->notifications()->orderBy('created_at', 'desc')->get();

        // Transform notifications to match frontend expectations
        $transformedNotifications = $notifications->map(function ($notification) {
            $data = $notification->data;
            return [
                'id' => $notification->id,
                'type' => $data['type'] ?? 'general',
                'title' => $data['title'] ?? 'Notification',
                'message' => $data['message'] ?? '',
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
                'updated_at' => $notification->updated_at,
                // Include additional data for specific notification types
                'booking_id' => $data['booking_id'] ?? null,
                'ride_id' => $data['ride_id'] ?? null,
                'passenger_id' => $data['passenger_id'] ?? null,
                'driver_id' => $data['driver_id'] ?? null,
                'seats_booked' => $data['seats_booked'] ?? null,
                'total_price' => $data['total_price'] ?? null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedNotifications
        ]);
    }

    public function getUnreadCount()
    {
        $count = Auth::user()->unreadNotifications()->count();

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $count
            ]
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read'
        ]);
    }

    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read'
        ]);
    }

    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted'
        ]);
    }
}
