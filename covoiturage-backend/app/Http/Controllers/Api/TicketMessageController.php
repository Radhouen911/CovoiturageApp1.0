<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketMessage; // Make sure this model exists
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TicketMessageController extends Controller
{
    /**
     * Display a listing of the messages for a specific ticket.
     *
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Ticket $ticket)
    {
        // Ensure the authenticated user has access to this ticket
        // A user can view their own ticket's messages, or an admin can view any ticket's messages.
        if (auth()->user()->id !== $ticket->user_id && !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé à consulter les messages de ce ticket.'
            ], 403); // Forbidden
        }

        // Load messages with the user who sent them, ordered by creation time
        $messages = $ticket->messages()->with('user:id,name')->orderBy('created_at', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Store a newly created message for a specific ticket.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Ticket $ticket)
    {
        // Ensure the authenticated user has access to this ticket
        if (auth()->user()->id !== $ticket->user_id && !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé à envoyer des messages pour ce ticket.'
            ], 403); // Forbidden
        }

        // Prevent sending messages to a closed ticket
        if ($ticket->status === 'closed') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible d\'envoyer des messages à un ticket fermé.'
            ], 400); // Bad Request
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:2000', // Message content
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422); // Unprocessable Entity
        }

        // Create the message associated with the ticket and the authenticated user
        $message = $ticket->messages()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        // Eager load the user relationship for the response, so frontend can display sender name
        $message->load('user:id,name');

        // Update the ticket's updated_at timestamp to reflect new activity
        $ticket->touch();

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès.',
            'data' => $message
        ], 201); // Created
    }
}
