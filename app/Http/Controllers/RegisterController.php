<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;


class RegisterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Login/Register');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised()],
            'age' => ['required', 'numeric', 'between:1,150'],
            'weight' => ['required', 'numeric', 'between:1,999.99'],
            'height' => ['required', 'numeric', 'between:1,999.99'],
            'goal_calories' => ['required', 'integer', 'min:500', 'max:10000'],
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'age' => $validatedData['age'],
                'weight' => $validatedData['weight'],
                'height' => $validatedData['height'],
                'goal_calories' => $validatedData['goal_calories'],
            ]);

            event(new Registered($user));

            DB::commit();

            return redirect()->route('login')
                ->with('success', 'ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง']);
        }
    }
}
