<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->middleware(['auth', 'verified', 'admin'])->group(function () {
    // Dasboard
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

    // Categorys
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


});
