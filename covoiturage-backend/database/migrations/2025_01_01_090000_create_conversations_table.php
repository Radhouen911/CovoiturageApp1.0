<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->timestamps();
            
            // Only add foreign key if rides table exists
            if (Schema::hasTable('rides')) {
                $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
            }
        });
    }

    public function down()
    {
        Schema::dropIfExists('conversations');
    }
};