<?php

use App\Http\Controllers\Admin\SecretKeyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if(auth()->user()){
        return redirect(route('admin.dashboard'));
    }
    return redirect(route('login'));
})->name('home');

// Route::get('/api-secret-key', [SecretKeyController::class, 'index']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';