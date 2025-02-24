<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\UserFoodLogsController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/menu/store', [FoodController::class, 'store']);
    Route::get('/menu', [FoodController::class, 'index']);
    Route::get('/menu/general', [FoodController::class, 'general']);
    Route::get('/menu/dessert', [FoodController::class, 'dessert']);
    Route::get('/menu/healthy', [FoodController::class, 'healthy']);
    Route::get('/menu/junk', [FoodController::class, 'junk']);
    Route::get('/menu/beverages', [FoodController::class, 'beverages']);
});
