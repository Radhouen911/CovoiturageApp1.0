<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('rides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained('users')->onDelete('cascade');
            $table->string('from');
            $table->string('to');
            $table->date('date');
            $table->time('time');
            $table->decimal('price', 8, 2);
            $table->integer('available_seats');
            $table->integer('total_seats');
            $table->string('car');
            $table->text('description')->nullable();
            $table->json('amenities')->nullable();
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('rides');
    }
};