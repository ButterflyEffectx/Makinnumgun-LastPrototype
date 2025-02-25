<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\DailySummaryController;

Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Food routes
    Route::post('/menu/store', [FoodController::class, 'store']);
    Route::get('/menu', [FoodController::class, 'index']);
    Route::get('/menu/general', [FoodController::class, 'general']);
    Route::get('/menu/dessert', [FoodController::class, 'dessert']);
    Route::get('/menu/healthy', [FoodController::class, 'healthy']);
    Route::get('/menu/junk', [FoodController::class, 'junk']);
    Route::get('/menu/beverages', [FoodController::class, 'beverages']);

     // Daily summary routes
     Route::get('/daily-summary', [DailySummaryController::class, 'getDailyData']);
     Route::get('/food-logs', [DailySummaryController::class, 'getFoodLogs']);
});
