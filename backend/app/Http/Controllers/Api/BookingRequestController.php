<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = BookingRequest::with(['listing.user', 'renter']);

        if ($request->type === 'received') {
            $query->whereHas('listing', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            });
        } else {
            $query->where('renter_id', $request->user()->id);
        }

        $requests = $query->latest()->paginate(10);
        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'listing_id' => 'required|exists:listings,id',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after:start_date',
            'message' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $listing = Listing::findOrFail($request->listing_id);

        if ($listing->user_id === $request->user()->id) {
            return response()->json(['message' => 'You cannot request your own listing'], 422);
        }

        $existingRequest = BookingRequest::where('listing_id', $request->listing_id)
                                       ->where('renter_id', $request->user()->id)
                                       ->whereIn('status', ['pending', 'accepted'])
                                       ->first();

        if ($existingRequest) {
            return response()->json(['message' => 'You already have an active request for this listing'], 422);
        }

        $bookingRequest = BookingRequest::create([
            'listing_id' => $request->listing_id,
            'renter_id' => $request->user()->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        return response()->json($bookingRequest->load(['listing.user', 'renter']), 201);
    }

    public function show(BookingRequest $bookingRequest)
    {
        $bookingRequest->load(['listing.user', 'renter']);
        return response()->json($bookingRequest);
    }

    public function update(Request $request, BookingRequest $bookingRequest)
    {
        $listing = $bookingRequest->listing;

        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:accepted,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $bookingRequest->update(['status' => $request->status]);

        return response()->json($bookingRequest->load(['listing.user', 'renter']));
    }

    public function destroy(Request $request, BookingRequest $bookingRequest)
    {
        if ($bookingRequest->renter_id !== $request->user()->id && 
            $bookingRequest->listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $bookingRequest->delete();
        return response()->json(['message' => 'Booking request deleted successfully']);
    }
}
