<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware('checkApiSecretKey')->group(function () {
    // User Route
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::get('/delete', [AuthController::class, 'delete']);
    });

// Categories Route
    Route::get('/categories/all', [CategoryController::class, 'index']);
    Route::get('/category/{category}/sub', [CategoryController::class, 'subIndex']);

// Products Route
    Route::get('/products/all', [ProductController::class, 'index']);
    Route::get('/product/{slug}', [ProductController::class, 'show']);
    Route::get('/product/category/{category}', [ProductController::class, 'category']);

// Carts Route
    Route::get('/cart/{userIdOrSessionId}', [CartController::class, 'show']);
    Route::post('/cart', [CartController::class, 'createOrUpdate']);
    Route::put('/cart/item/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/item/{id}', [CartController::class, 'removeItem']);
    Route::delete('/cart/{id}', [CartController::class, 'clear']);

// Order Route
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/order', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/order/{orderId}', [OrderController::class, 'show']);
        Route::put('/order/{orderId}/cancel', [OrderController::class, 'cancel']);
    });
//
});
