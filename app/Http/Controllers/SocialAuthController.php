<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;

class SocialAuthController extends Controller
{
    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')->redirect();
    }

    public function handleFacebookCallback()
    {
        try {
            $facebookUser = Socialite::driver('facebook')->user();

            $user = User::updateOrCreate(
                ['facebook_id' => $facebookUser->id],
                [
                    'name' => $facebookUser->name,
                    'email' => $facebookUser->email,
                    'facebook_token' => $facebookUser->token,
                    'email_verified_at' => now(), // มาร์คว่าตรวจสอบแล้วเพราะมาจาก Facebook
                ]
            );

            Auth::login($user);
            return redirect()->intended('dashboard');

        } catch (Exception $e) {
            Log::error('Facebook login error: ' . $e->getMessage());
            return redirect()->route('login')
                ->withErrors(['error' => 'ไม่สามารถล็อกอินผ่าน Facebook ได้ กรุณาลองใหม่อีกครั้ง']);
        }
    }
}
