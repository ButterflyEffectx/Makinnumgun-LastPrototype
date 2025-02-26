<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MakinnumgunController;
use App\Http\Controllers\ManagementController;
use App\Http\Controllers\DailySummaryController;
use App\Http\Controllers\UserFoodLogsController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::resource('/', MakinnumgunController::class);


//menu
Route::get('menu', [FoodController::class, 'index'])
    ->name('menu.index');
Route::get('/menu/general', [FoodController::class, 'general'])
    ->name('menu.general');
Route::get('/menu/dessert', [FoodController::class, 'dessert'])
    ->name('menu.dessert');
Route::get('/menu/healthy', [FoodController::class, 'healty'])
    ->name('menu.healthy');
Route::get('/menu/junk', [FoodController::class, 'junk'])
    ->name('menu.junk');
Route::get('/menu/beverages', [FoodController::class, 'beverages'])
    ->name('menu.beverages');
Route::post('/menu', [FoodController::class, 'store'])
    ->name('menu.store')
    ->middleware('auth:sanctum');

Route::get('/dashboard', [DailySummaryController::class, 'index'])
    ->name('dashboard');

Route::resource('management', ManagementController::class);

Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Login/Register');
})->name('register');
require __DIR__ . '/auth.php';
