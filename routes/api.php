// api.php
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public API routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Food API routes
    Route::get('/menu', [FoodController::class, 'index']);
    Route::post('/menu', [FoodController::class, 'store']);
    Route::get('/menu/general', [FoodController::class, 'general']);
    Route::get('/menu/dessert', [FoodController::class, 'dessert']);
    Route::get('/menu/healthy', [FoodController::class, 'healthy']);
    Route::get('/menu/junk', [FoodController::class, 'junk']);
    Route::get('/menu/beverages', [FoodController::class, 'beverages']);
});
