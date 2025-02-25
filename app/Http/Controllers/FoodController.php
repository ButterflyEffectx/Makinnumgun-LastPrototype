<?php

namespace App\Http\Controllers;

use App\Models\food;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Catagory;

use Inertia\Inertia;
use App\Models\UserFoodLogs;
use App\Models\User;
use App\Models\DailySummary;
use Carbon\Carbon;

class FoodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // ดึงข้อมูลอาหารพร้อมความสัมพันธ์กับ category
        $users = db::table('users')->get();
        $foods = DB::table('foods')
            ->get();
        $catagorry = DB::table('catagory')->get();

        $categories = Catagory::all();

        // ดึงข้อมูล categories ทั้งหมด
        $categories = Catagory::all();

        // ส่งข้อมูลไปยังหน้า Index.jsx
        return Inertia::render('Menu/Index', [
            'menuItems' => DB::table('foods')->get(), // เปลี่ยนจาก food เป็น foods
            'categories' => DB::table('catagory')->get(), // ตามโครงสร้าง DB ของคุณ
            'users' => DB::table('users')->get(),
            'auth' => [
                'user' => $request->user()
            ]
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
        // เริ่มต้นการทำงาน
        Log::info('Starting food store process');

        // ตรวจสอบการล็อกอิน
        if (!auth('sanctum')->check()) {
            Log::warning('Authentication failed: User not logged in');
            return response()->json(['message' => 'กรุณาเข้าสู่ระบบก่อนบันทึกรายการอาหาร'], 401);
        }


        Log::info('Step completed: Authentication check passed');

        // ตรวจสอบ request ว่ามีข้อมูลครบถ้วน
        try {
            $request->validate([
                'foods' => 'required|array',
                'foods.*.food_id' => 'required|exists:foods,id',
                'foods.*.catagory_id' => 'required|exists:catagory,id',
                'foods.*.servings' => 'required|numeric|min:0.01',
                'foods.*.total_calories' => 'required|numeric|min:0'
            ]);
            Log::info('Validation passed:', $request->all());
        } catch (\Exception $e) {
            Log::error('Validation error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'message' => 'ข้อมูลไม่ถูกต้อง',
                'error' => $e->getMessage()
            ], 422);
        }

        try {
            DB::beginTransaction();
            Log::info('Step completed: DB transaction started');

            $today = Carbon::today();
            // รองรับทั้ง API token และ session authentication
            $userId = auth('sanctum')->id();
            $totalCalories = 0;

            Log::info('User ID:', ['id' => $userId]);
            Log::info('Request data: ', $request->all());

            foreach ($request->foods as $index => $food) {
                Log::info('Processing food item ' . ($index + 1), $food);

                // ตรวจสอบว่า food_id มีอยู่จริง
                $foodExists = DB::table('foods')->where('id', $food['food_id'])->exists();
                if (!$foodExists) {
                    throw new \Exception('Food ID ' . $food['food_id'] . ' not found');
                }

                // ตรวจสอบว่า catagory_id มีอยู่จริง
                $categoryExists = DB::table('catagory')->where('id', $food['catagory_id'])->exists();
                if (!$categoryExists) {
                    throw new \Exception('Category ID ' . $food['catagory_id'] . ' not found');
                }

                Log::info('Step completed: Food and category validation passed for item ' . ($index + 1));

                // สร้าง UserFoodLogs record
                UserFoodLogs::create([
                    'user_id' => $userId,
                    'food_id' => $food['food_id'],
                    'catagory_id' => $food['catagory_id'],
                    'servings' => $food['servings'],
                    'total_calories' => $food['total_calories'],
                    'date' => $today
                ]);

                Log::info('Step completed: Created food log for item ' . ($index + 1));

                $totalCalories += $food['total_calories'];
            }

            Log::info('Step completed: All food items processed, total calories: ' . $totalCalories);

            // ตรวจสอบและอัปเดต daily summary
            $dailySummary = DailySummary::firstOrNew([
                'user_id' => $userId,
                'date' => $today
            ]);

            Log::info('Daily summary found: ' . ($dailySummary->exists ? 'Yes' : 'No'));

            if (!$dailySummary->exists) {
                $dailySummary->goal_calories = 2000;
                $dailySummary->total_calories_consumed = $totalCalories;
            } else {
                $dailySummary->total_calories_consumed += $totalCalories;
            }

            $dailySummary->calories_difference =
                $dailySummary->goal_calories - $dailySummary->total_calories_consumed;
            $dailySummary->save();

            Log::info('Step completed: Daily summary updated');

            DB::commit();
            Log::info('Step completed: Transaction committed successfully');

            return response()->json([
                'message' => 'บันทึกรายการอาหารเรียบร้อยแล้ว',
                'daily_summary' => $dailySummary
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error occurred: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'เกิดข้อผิดพลาดในการบันทึกรายการอาหาร',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
