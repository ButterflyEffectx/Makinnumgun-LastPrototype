<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_food_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('food_id')->constrained('foods');
<<<<<<< HEAD
            $table->foreignId('catagory_id')->constrained('catagory');
=======
            $table->string('catagory_id')->constrained('catagory');
>>>>>>> 94f94ec (comfirm commit)
            $table->decimal('servings',5,2);
            $table->integer('total_calories');
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_food_logs');
    }
};
