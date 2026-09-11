<?php

use App\Http\Controllers\ScanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::post('/scan', [ScanController::class, 'find'])->name('scan.find');
