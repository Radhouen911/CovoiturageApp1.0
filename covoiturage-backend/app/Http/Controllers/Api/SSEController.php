<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SSEController extends Controller
{
    public function stream(Request $request, $conversationId)
    {
        // Get token from query parameter since EventSource doesn't support custom headers
        $token = $request->query('token');

        if (!$token) {
            return response()->json(['error' => 'Token required'], 401);
        }

        // Verify token and get user
        try {
            $user = \Laravel\Sanctum\PersonalAccessToken::findToken($token)->tokenable;
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        // Verify user is part of conversation
        $conversation = Conversation::where('id', $conversationId)
            ->where(function ($query) use ($user) {
                $query->where('user1_id', $user->id)
                      ->orWhere('user2_id', $user->id);
            })
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        // Set headers for SSE
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Cache-Control');
        header('X-Accel-Buffering: no'); // Disable nginx buffering

        // Get the last message ID to check for new messages
        $lastMessageId = $request->get('last_message_id', 0);
        $pingCounter = 0;

        // Keep connection alive and check for new messages
        while (true) {
            // Check for new messages
            $newMessages = Message::where('conversation_id', $conversationId)
                ->where('id', '>', $lastMessageId)
                ->where('sender_id', '!=', $user->id) // Only messages from other users
                ->with('sender')
                ->orderBy('created_at', 'asc')
                ->get();

            foreach ($newMessages as $message) {
                $data = [
                    'id' => $message->id,
                    'content' => $message->content,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $message->sender->name,
                    'conversation_id' => $message->conversation_id,
                    'created_at' => $message->created_at,
                ];

                echo "data: " . json_encode($data) . "\n\n";
                ob_flush();
                flush();

                $lastMessageId = $message->id;
            }

            // Send keep-alive every 15 seconds (reduced from 30)
            $pingCounter++;
            if ($pingCounter >= 7) { // 7 * 1 second = 7 seconds for ping
                echo "data: " . json_encode(['type' => 'ping']) . "\n\n";
                ob_flush();
                flush();
                $pingCounter = 0;
            }

            // Sleep for 1 second before checking again (reduced from 2)
            sleep(1);
        }
    }
}
