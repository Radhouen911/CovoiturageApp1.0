<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->foreignId('user1_id')->after('id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user2_id')->after('user1_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('last_message_at')->nullable()->after('ride_id');

            // Add unique constraint
            $table->unique(['user1_id', 'user2_id', 'ride_id']);
        });
    }

    public function down()
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropForeign(['user1_id']);
            $table->dropForeign(['user2_id']);
            $table->dropColumn(['user1_id', 'user2_id', 'last_message_at']);
        });
    }
};
