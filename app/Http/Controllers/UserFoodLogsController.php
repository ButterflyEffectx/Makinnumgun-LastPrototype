<?php

namespace App\Http\Controllers;

use App\Models\UserFoodLogs;
use App\Models\DailySummary;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class UserFoodLogsController extends Controller
{
    public function index(Request $request)
    {
        // ตรวจสอบการล็อกอิน
        if (!session()->has('user_id')) {
            return response()->json([
                'message' => 'กรุณาเข้าสู่ระบบก่อน'
            ], 401);
        }

        $date = $request->get('date', Carbon::today()->toDateString());
        $userId = session()->get('user_id');

        $logs = UserFoodLogs::with(['food', 'category'])
            ->where('user_id', $userId)
            ->whereDate('date', $date)
            ->orderBy('created_at', 'desc')
            ->get();

        $summary = DailySummary::where('user_id', $userId)
            ->whereDate('date', $date)
            ->first();

        if (!$summary) {
            $summary = new DailySummary([
                'goal_calories' => 2000,
                'total_calories_consumed' => 0,
                'calories_difference' => 2000
            ]);
        }

        return response()->json([
            'logs' => $logs,
            'summary' => $summary
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'foods' => 'required|array',
            'foods.*.food_id' => 'required|exists:foods,id',
            'foods.*.category_id' => 'required|exists:categories,id',
            'foods.*.servings' => 'required|numeric|min:0.01',
            'foods.*.total_calories' => 'required|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            $today = Carbon::today();
            $userId = session()->get('user_id');
            $totalCalories = 0;

            foreach ($request->foods as $food) {
                $foodLog = new UserFoodLogs([
                    'user_id' => $userId,
                    'food_id' => $food['food_id'],
                    'category_id' => $food['category_id'],
                    'servings' => $food['servings'],
                    'total_calories' => $food['total_calories'],
                    'date' => $today
                ]);
                $foodLog->save();

                $totalCalories += $food['total_calories'];
            }

            $dailySummary = DailySummary::where([
                'user_id' => $userId,
                'date' => $today
            ])->first();

            if (!$dailySummary) {
                $dailySummary = new DailySummary([
                    'user_id' => $userId,
                    'date' => $today,
                    'goal_calories' => 2000,
                    'total_calories_consumed' => $totalCalories,
                    'calories_difference' => 2000 - $totalCalories
                ]);
            } else {
                $dailySummary->total_calories_consumed += $totalCalories;
                $dailySummary->calories_difference =
                    $dailySummary->goal_calories - $dailySummary->total_calories_consumed;
            }

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
