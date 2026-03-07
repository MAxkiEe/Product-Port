<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserProfileController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            // Password update is optional
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function orders(Request $request)
    {
        // Mocking some orders since there is no Orders table yet
        $mockOrders = [
            [
                'id' => 'ORD-1001',
                'date' => now()->subDays(2)->format('Y-m-d'),
                'total' => 1500.00,
                'status' => 'Delivered'
            ],
            [
                'id' => 'ORD-1005',
                'date' => now()->subDays(10)->format('Y-m-d'),
                'total' => 320.50,
                'status' => 'Processing'
            ]
        ];

        return response()->json($mockOrders);
    }
}
