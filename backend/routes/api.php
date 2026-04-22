<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingRequestController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Listings
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);

// Users
Route::get('/users/{user}', [UserController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // User management
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/user/profile-image', [UserController::class, 'updateProfileImage']);
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    // Categories (admin only)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Listings
    Route::post('/listings', [ListingController::class, 'store']);
    Route::put('/listings/{listing}', [ListingController::class, 'update']);
    Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);
    Route::get('/my-listings', [ListingController::class, 'myListings']);

    // Listing images
    Route::delete('/listing-images/{image}', [ListingController::class, 'deleteImage']);

    // Booking requests
    Route::get('/booking-requests', [BookingRequestController::class, 'index']);
    Route::post('/booking-requests', [BookingRequestController::class, 'store']);
    Route::get('/booking-requests/{bookingRequest}', [BookingRequestController::class, 'show']);
    Route::put('/booking-requests/{bookingRequest}', [BookingRequestController::class, 'update']);
    Route::delete('/booking-requests/{bookingRequest}', [BookingRequestController::class, 'destroy']);
});

// Image upload for listings
Route::middleware('auth:sanctum')->post('/listings/{listing}/images', function (Request $request, $listingId) {
    $request->validate([
        'images' => 'required|array',
        'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $listing = \App\Models\Listing::findOrFail($listingId);
    
    if ($listing->user_id !== $request->user()->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $uploadedImages = [];
    
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $index => $image) {
            $imageName = time() . '_' . $index . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('storage/listing_images'), $imageName);
            
            $listingImage = \App\Models\ListingImage::create([
                'listing_id' => $listing->id,
                'image_path' => 'listing_images/' . $imageName,
                'sort_order' => $index,
            ]);
            
            $uploadedImages[] = $listingImage;
        }
    }

    return response()->json($uploadedImages, 201);
});
