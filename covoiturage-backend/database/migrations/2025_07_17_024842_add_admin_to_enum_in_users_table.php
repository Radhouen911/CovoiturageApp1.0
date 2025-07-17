<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddAdminToEnumInUsersTable extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE users MODIFY role ENUM('driver', 'passenger', 'admin') DEFAULT 'passenger'");
    }

    public function down()
    {
        DB::statement("ALTER TABLE users MODIFY role ENUM('driver', 'passenger') DEFAULT 'passenger'");
    }
}
