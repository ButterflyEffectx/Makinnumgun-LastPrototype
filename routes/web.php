// web.php
<?php

use App\Http\Controllers\FoodController;
use App\Http\Controllers\FoodLogController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MakinnumgunController;
use App\Http\Controllers\ManagementController;
use App\Http\Controllers\UserDashController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Menu routes (web interface)
Route::get('/menu', [FoodController::class, 'index'])->name('menu.index');
Route::get('/menu/general', [FoodController::class, 'general'])->name('menu.general');
Route::get('/menu/dessert', [FoodController::class, 'dessert'])->name('menu.dessert');
Route::get('/menu/healthy', [FoodController::class, 'healthy'])->name('menu.healthy'); // Fix typo from 'healty'
Route::get('/menu/junk', [FoodController::class, 'junk'])->name('menu.junk');
Route::get('/menu/beverages', [FoodController::class, 'beverages'])->name('menu.beverages');

// Authentication routes
Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Login/Register');
})->name('register');

// Include authentication routes
require __DIR__ . '/auth.php';

// Protected routes (require authentication)
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Food creation route
    Route::post('/menu', [FoodController::class, 'store'])->name('menu.store');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/food/store', [FoodLogController::class, 'store']);
    // routes อื่นๆ ที่ต้องการ auth
});

// Resource Controllers
Route::resource('makinnumgun', MakinnumgunController::class);
Route::resource('management', ManagementController::class);
Route::resource('userdash', UserDashController::class);
