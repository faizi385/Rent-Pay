<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user() || $request->user()->email !== 'admin@rentpay.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::latest()->paginate(20);
        return response()->json($users);
    }

    public function show(User $user)
    {
        $user->load(['listings' => function ($query) {
            $query->where('is_available', true)->with(['category', 'images'])->latest();
        }]);

        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'city' => $request->city,
            'bio' => $request->bio,
        ]);

        return response()->json($user);
    }

    public function updateProfileImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        if ($request->hasFile('profile_image')) {
            $image = $request->file('profile_image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('storage/profile_images'), $imageName);
            
            $user->profile_image = 'profile_images/' . $imageName;
            $user->save();
        }

        return response()->json($user);
    }

    public function destroy(Request $request, User $user)
    {
        if (!$request->user() || $request->user()->email !== 'admin@rentpay.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
