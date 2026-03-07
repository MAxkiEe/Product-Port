<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
                ->middleware('guest')
                ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
                ->middleware('guest')
                ->name('password.store');

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\SecurityController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // User Profile & Settings
    Route::get('/user/profile', [UserProfileController::class, 'profile']);
    Route::put('/user/profile', [UserProfileController::class, 'updateProfile']);
    // Orders & Payment
    Route::get('/user/orders', [OrderController::class, 'getMyOrders']);
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::post('/payment/process', [PaymentController::class, 'processPayment']);

    // User Management
    Route::apiResource('users', UserController::class);
    Route::get('/roles', [UserController::class, 'roles']);

    // Admin Order & Revenue Management
    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Permission Management
    Route::apiResource('permissions', PermissionController::class)->only(['index', 'store', 'destroy']);

    // Security (Visitor Tracking & IP Blocking)
    Route::get('/security/visitors', [SecurityController::class, 'getVisitors']);
    Route::get('/security/blocked-ips', [SecurityController::class, 'getBlockedIps']);
    Route::post('/security/block-ip', [SecurityController::class, 'blockIp']);
    Route::delete('/security/block-ip/{id}', [SecurityController::class, 'unblockIp']);
});
