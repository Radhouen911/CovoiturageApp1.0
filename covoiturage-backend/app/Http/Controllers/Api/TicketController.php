<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $tickets = Ticket::with('user', 'ride')->get();
        return response()->json(['success' => true, 'data' => $tickets]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'ride_id' => 'nullable|exists:rides,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $ticket = Ticket::create([
            'user_id' => $request->user_id,
            'ride_id' => $request->ride_id,
            'subject' => $request->subject,
            'description' => $request->description,
            'status' => 'open',
        ]);

        return response()->json(['success' => true, 'data' => $ticket]);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $ticket = Ticket::findOrFail($id);
        $request->validate([
            'status' => 'required|in:open,in_progress,closed',
        ]);

        $ticket->update([
            'status' => $request->status,
        ]);

        return response()->json(['success' => true, 'data' => $ticket]);
    }
}
