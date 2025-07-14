<?php

namespace App\Http\Controllers\Api;

use App\Events\NewMessage;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Ride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $conversations = Conversation::where('user1_id', $user->id)
            ->orWhere('user2_id', $user->id)
            ->with(['user1', 'user2', 'ride', 'messages' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($conversation) use ($user) {
                $conversation->other_user = $conversation->getOtherUser($user->id);
                $conversation->unread_count = $conversation->messages()
                    ->where('sender_id', '!=', $user->id)
                    ->where('read_at', null)
                    ->count();
                return $conversation;
            });

        return response()->json([
            'success' => true,
            'data' => $conversations
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'other_user_id' => 'required|exists:users,id',
            'ride_id' => 'nullable|exists:rides,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $otherUserId = $request->other_user_id;
        $rideId = $request->ride_id;

        // Prevent creating conversation with yourself
        if ($user->id === $otherUserId) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas créer une conversation avec vous-même'
            ], 400);
        }

        // Check if conversation already exists
        $existingConversation = Conversation::where(function ($query) use ($user, $otherUserId, $rideId) {
            $query->where(function ($q) use ($user, $otherUserId, $rideId) {
                $q->where('user1_id', $user->id)
                  ->where('user2_id', $otherUserId)
                  ->where('ride_id', $rideId);
            })->orWhere(function ($q) use ($user, $otherUserId, $rideId) {
                $q->where('user1_id', $otherUserId)
                  ->where('user2_id', $user->id)
                  ->where('ride_id', $rideId);
            });
        })->first();

        if ($existingConversation) {
            return response()->json([
                'success' => true,
                'message' => 'Conversation trouvée',
                'data' => $existingConversation->load(['user1', 'user2', 'ride'])
            ]);
        }

        // Create new conversation
        $conversation = Conversation::create([
            'user1_id' => $user->id,
            'user2_id' => $otherUserId,
            'ride_id' => $rideId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Conversation créée avec succès',
            'data' => $conversation->load(['user1', 'user2', 'ride'])
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $conversation = Conversation::where('id', $id)
            ->where(function ($query) use ($user) {
                $query->where('user1_id', $user->id)
                      ->orWhere('user2_id', $user->id);
            })
            ->with(['user1', 'user2', 'ride', 'messages.sender'])
            ->first();

        if (!$conversation) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation introuvable'
            ], 404);
        }

        // Mark messages as read
        $conversation->markAsRead($user->id);

        return response()->json([
            'success' => true,
            'data' => $conversation
        ]);
    }

    public function sendMessage(Request $request, $conversationId)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        $conversation = Conversation::where('id', $conversationId)
            ->where(function ($query) use ($user) {
                $query->where('user1_id', $user->id)
                      ->orWhere('user2_id', $user->id);
            })
            ->first();

        if (!$conversation) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation introuvable'
            ], 404);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'content' => $request->content,
        ]);

        // Update conversation's last_message_at
        $conversation->update(['last_message_at' => now()]);

        // Load the sender relationship for broadcasting
        $message->load('sender');

        // Broadcast the new message event with logging
        try {
            broadcast(new NewMessage($message))->toOthers();
            \Log::info('Message broadcasted successfully', [
                'message_id' => $message->id,
                'conversation_id' => $conversation->id,
                'sender_id' => $user->id
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to broadcast message', [
                'message_id' => $message->id,
                'error' => $e->getMessage()
            ]);
            // Continue even if broadcasting fails - message is still saved
        }

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès',
            'data' => $message->load('sender')
        ], 201);
    }
}
