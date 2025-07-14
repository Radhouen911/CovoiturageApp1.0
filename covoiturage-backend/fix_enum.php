<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use App\Models\Booking;

try {
    echo "Starting ENUM fix...\n";

    // First, update any existing 'confirmed' bookings to 'accepted'
    $updated = Booking::where('status', 'confirmed')->update(['status' => 'accepted']);
    echo "Updated {$updated} bookings from 'confirmed' to 'accepted'\n";

    // Now update the ENUM definition
    DB::statement('ALTER TABLE bookings MODIFY status ENUM("pending", "accepted", "rejected", "cancelled", "completed") DEFAULT "pending"');

    echo "ENUM updated successfully!\n";

    // Verify the change
    $result = DB::select("SHOW COLUMNS FROM bookings LIKE 'status'");
    echo "Current ENUM values: " . $result[0]->Type . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
