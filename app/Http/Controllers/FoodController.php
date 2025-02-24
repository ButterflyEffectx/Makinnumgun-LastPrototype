<?php

namespace App\Http\Controllers;

use App\Models\food;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Catagory;
use Inertia\Inertia;
use App\Models\UserFoodLogs;
use App\Models\User;
use App\Models\DailySummary;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class FoodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info('User authenticated: ', ['user' => Auth::user()]);
        // ดึงข้อมูลอาหารพร้อมความสัมพันธ์กับ category
        $users = db::table('users')->get();
        $foods = DB::table('foods')
            ->get();
        $catagorry = DB::table('catagory')->get();

        $categories = Catagory::all();
        $user = Auth::user();

        // ดึงข้อมูล categories ทั้งหมด
        $categories = Catagory::all();

        // ส่งข้อมูลไปยังหน้า Index.jsx
        return Inertia::render('Menu/Index', [
            'menuItems' => DB::table('foods')->get(), // เปลี่ยนจาก food เป็น foods
            'categories' => DB::table('catagory')->get(), // ตามโครงสร้าง DB ของคุณ
            'users' => $user,
            'isAuthenticated' => Auth::check(),
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function general()
    {
        // ดึงข้อมูลอาหารพร้อมความสัมพันธ์กับ category
        $foods = DB::table('foods')
            ->where('catagory_id', 1)
            ->get();

        // ดึงข้อมูล categories ทั้งหมด
        $categories = Catagory::all();

        // ส่งข้อมูลไปยังหน้า Index.jsx
        return Inertia::render('Menu/General_food', [
            'menuItems' => $foods,
            'categories' => $categories,
        ]);
    }

    public function dessert()
    {
        // ดึงข้อมูลอาหารพร้อมความสัมพันธ์กับ category
        $foods = DB::table('foods')
            ->where('catagory_id', 2)
            ->get();

        // ดึงข้อมูล categories ทั้งหมด
        $categories = Catagory::all();

        // ส่งข้อมูลไปยังหน้า Index.jsx
        return Inertia::render('Menu/Dessert_food', [
            'menuItems' => $foods,
            'categories' => $categories
        ]);
    }

    public function healty()
    {
        // ดึงข้อมูลอาหารพร้อมความสัมพันธ์กับ category
        $foods = DB::table('foods')
            ->where('catagory_id', 3)
            ->get();

        // ดึงข้อมูล categories ทั้งหมด
        $categories = Catagory::all();

        // ส่งข้อมูลไปยังหน้า Index.jsx
        return Inertia::render('Menu/Healthy_food', [
            'menuItems' => $foods,
            'categories' => $categories
        ]);
    }

    public function junk()
    {
        // ดึงข้อมูลอาหารพร้อมความสัมพันธ์กับ category
        $foods = DB::table('foods')
            ->where('catagory_id', 4)
            ->get();

        // ดึงข้อมูล categories ทั้งหมด
        $categories = Catagory::all();

        // ส่งข้อมูลไปยังหน้า Index.jsx
        return Inertia::render('Menu/Junk_food', [
            'menuItems' => $foods,
            'categories' => $categories
        ]);
    }

    public function beverages()
    {
        // ดึงข้อมูลอาหารพร้อมความสัมพันธ์กับ category
        $foods = DB::table('foods')
            ->where('catagory_id', 5)
            ->get();

        // ดึงข้อมูล categories ทั้งหมด
        $categories = Catagory::all();

        // ส่งข้อมูลไปยังหน้า Index.jsx
        return Inertia::render('Menu/Beverages_food', [
            'menuItems' => $foods,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->$request->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'foods' => 'required|array',
            'foods.*.food_id' => 'required|exists:foods,id',
            'foods.*.catagory_id' => 'required|exists:catagory,id',
            'foods.*.servings' => 'required|numeric|min:0.01',
            'foods.*.total_calories' => 'required|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            $today = Carbon::today();
            $userId = $request->auth()->id();
            $totalCalories = 0;

            foreach ($request->foods as $foods) {
                UserFoodLogs::create([
                    'user_id' => $userId,
                    'food_id' => $foods['food_id'],
                    'catagory_id' => $foods['catagory_id'],
                    'servings' => $foods['servings'],
                    'total_calories' => $foods['total_calories'],
                    'date' => $today
                ]);

                $totalCalories += $foods['total_calories'];
            }

            $dailySummary = DailySummary::firstOrNew([
                'user_id' => $userId,
                'date' => $today
            ]);

            if (!$dailySummary->exists) {
                $dailySummary->goal_calories = 2000;
                $dailySummary->total_calories_consumed = $totalCalories;
            } else {
                $dailySummary->total_calories_consumed += $totalCalories;
            }

            $dailySummary->calories_difference =
                $dailySummary->goal_calories - $dailySummary->total_calories_consumed;
            $dailySummary->save();

            DB::commit();

            return response()->json([
                'message' => 'บันทึกรายการอาหารเรียบร้อยแล้ว',
                'daily_summary' => $dailySummary
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'เกิดข้อผิดพลาดในการบันทึกรายการอาหาร',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
