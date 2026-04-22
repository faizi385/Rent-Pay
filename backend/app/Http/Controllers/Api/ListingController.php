<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::with(['user', 'category', 'images'])
                        ->where('is_available', true);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        $listings = $query->latest()->paginate(12);
        
        return response()->json($listings);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'price_per_day' => 'required|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'city' => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $listing = Listing::create([
            'user_id' => $request->user()->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'price_per_day' => $request->price_per_day,
            'security_deposit' => $request->security_deposit,
            'city' => $request->city,
            'address' => $request->address,
            'is_available' => true,
        ]);

        return response()->json($listing->load(['user', 'category', 'images']), 201);
    }

    public function show(Listing $listing)
    {
        $listing->load(['user', 'category', 'images']);
        return response()->json($listing);
    }

    public function update(Request $request, Listing $listing)
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'price_per_day' => 'required|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'city' => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
            'is_available' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $listing->update($request->all());

        return response()->json($listing->load(['user', 'category', 'images']));
    }

    public function destroy(Request $request, Listing $listing)
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $listing->delete();
        return response()->json(['message' => 'Listing deleted successfully']);
    }

    public function myListings(Request $request)
    {
        $listings = Listing::with(['category', 'images'])
                           ->where('user_id', $request->user()->id)
                           ->latest()
                           ->paginate(12);

        return response()->json($listings);
    }

    public function deleteImage(Request $request, ListingImage $image)
    {
        // Check if the image belongs to a listing owned by the user
        if ($image->listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete the image file from storage
        if ($image->image_path) {
            $imagePath = storage_path('app/public/' . $image->image_path);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        // Delete the image record
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
