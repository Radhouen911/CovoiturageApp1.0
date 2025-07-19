<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TicketController extends Controller
{
    /**
     * Display a listing of tickets.
     * Admins see all tickets; regular users see only their own.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        if ($user->isAdmin()) {
            $tickets = Ticket::with('user:id,name')->orderByDesc('created_at')->get();
        } else {
            $tickets = $user->tickets()->with('user:id,name')->orderByDesc('created_at')->get();
        }

        return response()->json(['success' => true, 'data' => $tickets]);
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'ride_id' => 'nullable|exists:rides,id',
        ]);

        try {
            $ticket = Ticket::create([
                'user_id' => $user->id,
                'ride_id' => $request->ride_id,
                'subject' => $request->subject,
                'description' => $request->description,
                'status' => 'open', // Default status for a new ticket
                'priority' => 'medium', // Default priority, can be changed by admin
            ]);

            return response()->json(['success' => true, 'data' => $ticket->load('user:id,name')], 201);
        } catch (\Exception $e) {
            Log::error("Error creating ticket: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to create ticket. Please try again.'], 500);
        }
    }

    /**
     * Display the specified ticket.
     * Accessible by the ticket owner or an admin.
     */
    public function show(Request $request, Ticket $ticket) // Route Model Binding
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Authorize: Only the owner or an admin can view the ticket
        if ($user->id !== $ticket->user_id && !$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $ticket->load('user:id,name'); // Load the user who filed the ticket

        return response()->json(['success' => true, 'data' => $ticket]);
    }

    /**
     * Update the specified ticket (status or priority).
     * Only accessible by admins.
     */
    public function update(Request $request, Ticket $ticket) // Route Model Binding
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'sometimes|required|in:open,in_progress,closed',
            'priority' => 'sometimes|required|in:low,medium,high',
        ]);

        $ticket->update($request->only(['status', 'priority']));

        return response()->json(['success' => true, 'data' => $ticket]);
    }

    /**
     * Close a specified ticket.
     * Only accessible by admins.
     */
    public function close(Request $request, Ticket $ticket) // Route Model Binding
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $ticket->update(['status' => 'closed']);

        return response()->json(['success' => true, 'message' => 'Ticket closed successfully.', 'data' => $ticket]);
    }
}