<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\AttendeeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now()
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Event routes
Route::apiResource('events', EventController::class);

// Attendee routes
Route::post('events/{eventId}/register', [AttendeeController::class, 'register']);
Route::get('events/{eventId}/attendees', [AttendeeController::class, 'getEventAttendees']);
Route::apiResource('attendees', AttendeeController::class)->except(['index', 'store']);
