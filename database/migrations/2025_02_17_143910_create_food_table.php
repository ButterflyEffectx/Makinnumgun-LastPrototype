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
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
<<<<<<< HEAD
            $table->foreignId('catagory_id')->constrained('catagory');
=======
            $table->string('catagory_id')->constrained('catagory');
>>>>>>> 94f94ec (comfirm commit)
            $table->integer('calories');
            $table->decimal('protein', 5, 2);
            $table->decimal('carbs', 5, 2);
            $table->decimal('fats', 5, 2);
            $table->string('serving_size', 100);
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food');
    }
};
