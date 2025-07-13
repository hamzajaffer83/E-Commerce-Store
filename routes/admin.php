<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth', 'verified', 'admin'])->group(function () {
    // Dasboard
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/all-orders', [AdminController::class, 'allOrder'])->name('all.orders');
    Route::put('/update-order-status/{id}', [AdminController::class, 'updateOrderStatus'])->name('update.order.status');
    Route::get('/single-order/{id}', [AdminController::class, 'singleOrder'])->name('single.order');
    

    // Categories
    Route::prefix('/category')->group(function () {

        Route::get('/', [CategoryController::class, 'index'])->name("admin.category.index");
        Route::get('/create', [CategoryController::class, 'create'])->name("admin.category.create");
        Route::post('/store', [CategoryController::class, 'store'])->name("admin.category.store");
        Route::get('/edit/{categoryId}', [CategoryController::class, 'edit'])->name("admin.category.edit");
        Route::put('/update/{categoryId}', [CategoryController::class, 'update'])->name("admin.category.update");
        Route::delete('/delete/{categoryId}', [CategoryController::class, 'destroy'])->name("admin.category.destroy");
        // Sub Categories
        Route::prefix('/{parent_id}/sub')->group(function () {
            Route::get('/', [CategoryController::class, 'sub_index'])->name("admin.category.sub.index");
            Route::get('/create', [CategoryController::class, 'sub_create'])->name("admin.category.sub.create");
            Route::post('/store', [CategoryController::class, 'sub_store'])->name("admin.category.sub.store");
            Route::get('/edit/{subCategoryId}', [CategoryController::class, 'sub_edit'])->name("admin.category.sub.edit");
            Route::put('/update/{subCategoryId}', [CategoryController::class, 'sub_update'])->name("admin.category.sub.update");
            Route::delete('/delete/{subCategoryId}', [CategoryController::class, 'sub_destroy'])->name("admin.category.sub.destroy");
        });

    });

    // Products
    Route::prefix('/product')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name("admin.product.index");
        Route::get('/variant/{id}', [ProductController::class, 'show'])->name('single.product');
        Route::get('/create', [ProductController::class, 'create'])->name("admin.product.create");
        // Route::post('/store/variant/{productId}', [ProductController::class, 'storeVariant'])->name("admin.variant.create");
        Route::post('/store', [ProductController::class, 'store'])->name("admin.product.store");
        Route::get('/edit/{productId}', [ProductController::class, 'edit'])->name("admin.product.edit");
        Route::put('/update/{productId}', [ProductController::class, 'update'])->name("admin.product.update");
        Route::put('/update/variant/{variantId}', [ProductController::class, 'updateVariant'])->name("admin.variant.update");
        Route::post('/update/image', [ProductController::class, 'updateImage'])->name("admin.product.image.update");
        Route::delete('/delete/{productId}', [ProductController::class, 'destroy'])->name("admin.product.destroy");
        Route::delete('/delete/variant/{variantId}', [ProductController::class, 'destroyVariant'])->name("admin.product.variant.destroy");
    });

});
