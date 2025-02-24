<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MakinnumgunController;
use App\Http\Controllers\UserFoodLogsController;
use App\Http\Controllers\UserDashController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ManagementController;
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
Route::post('/menu', [FoodController::class, 'store'])->name('menu.store');

Route::middleware(['web'])->group(function () {
    Route::post('/menu/store', [FoodController::class, 'store'])->name('food.store');
});

Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Login/Register');
})->name('register');
require __DIR__ . '/auth.php';
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('makinnumgun', MakinnumgunController::class);
Route::resource('management', ManagementController::class);
Route::resource('userdash', UserDashController::class);

require __DIR__.'/auth.php';
