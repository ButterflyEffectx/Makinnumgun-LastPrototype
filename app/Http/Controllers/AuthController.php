<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed',
                    'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'],
                'age' => ['required', 'integer', 'min:1', 'max:150'],
                'weight' => ['required', 'numeric', 'min:1', 'max:999.99'],
                'height' => ['required', 'numeric', 'min:1', 'max:999.99'],
                'goal_calories' => ['required', 'integer', 'min:1', 'max:99999']
            ], [
                'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
            ]);

            // Begin database transaction
            DB::beginTransaction();

            try {
                // Create the user
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'age' => $validated['age'],
                    'weight' => $validated['weight'],
                    'height' => $validated['height'],
                    'goal_calories' => $validated['goal_calories']
                ]);

                // Generate token
                $tokenResult = $user->createToken('auth_token', ['*'], now()->addDays(30));

                // Store remember_token in users table
                $user->remember_token = hash('sha256', $tokenResult->plainTextToken);
                $user->save();

                // Commit transaction
                DB::commit();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Registration successful',
                    'user' => $user->only(['id', 'name', 'email', 'age', 'weight', 'height', 'goal_calories']),
                    'token' => $tokenResult->plainTextToken
                ], 201);

            } catch (\Exception $e) {
                // Rollback transaction if something goes wrong
                DB::rollBack();
                throw $e;
            }

        } catch (ValidationException $e) {
            Log::warning('Registration validation failed', [
                'errors' => $e->errors(),
                'input' => $request->except('password', 'password_confirmation')
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'System error occurred'
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if (Auth::attempt($credentials)) {
                $token = $request->user()->createToken('auth-token')->plainTextToken;

                return response()->json([
                    'token' => $token,
                    'user' => $request->user()
                ]);
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred during login.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Revoke the token that was used to authenticate the current request
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Logout failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Logout failed'
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            $user = $request->user()->only([
                'id', 'name', 'email', 'age', 'weight',
                'height', 'goal_calories', 'created_at'
            ]);

            return response()->json([
                'status' => 'success',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('User profile fetch failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch user data'
            ], 500);
        }
    }
}
