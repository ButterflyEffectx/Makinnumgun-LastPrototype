<?php

namespace App\Http\Controllers;

use App\Models\DailySummary;
use App\Models\UserFoodLogs;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class DailySummaryController extends Controller
{
    /**
     * แสดงหน้า Dashboard
     */
    public function index()
    {
        return Inertia::render('Kinraidee/Dashboard');
    }

    /**
     * ดึงข้อมูลสรุปประจำวันของผู้ใช้
     */
    public function getDailyData(Request $request)
    {
        $user = Auth::user();
        $date = $request->query('date', Carbon::today()->toDateString());

        // ค้นหาข้อมูลสรุปประจำวัน
        $dailySummary = DailySummary::where('user_id', $user->id)
            ->where('date', $date)
            ->first();

        // หากไม่มีข้อมูล ให้สร้างข้อมูลใหม่
        if (!$dailySummary) {
            // คำนวณแคลอรี่ที่บริโภคไปแล้ว
            $totalCaloriesConsumed = UserFoodLogs::where('user_id', $user->id)
                ->where('date', $date)
                ->sum('total_calories');

            // สร้างข้อมูลสรุปใหม่
            $dailySummary = new DailySummary();
            $dailySummary->user_id = $user->id;
            $dailySummary->date = $date;
            $dailySummary->total_calories_consumed = $totalCaloriesConsumed;
            $dailySummary->goal_calories = $user->goal_calories;
            $dailySummary->calories_difference = $user->goal_calories - $totalCaloriesConsumed;
            $dailySummary->save();
        }

        return response()->json([
            'status' => 'success',
            'data' => $dailySummary
        ]);
    }

    /**
     * ดึงข้อมูลรายการอาหารที่ผู้ใช้บันทึกในวันที่เลือก
     */
    public function getFoodLogs(Request $request)
    {
        $user = Auth::user();
        $date = $request->query('date', Carbon::today()->toDateString());

        // ดึงข้อมูลอาหารพร้อมความสัมพันธ์
        $foodLogs = UserFoodLogs::with(['food', 'category'])
            ->where('user_id', $user->id)
            ->where('date', $date)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $foodLogs
        ]);
    }

    /**
     * อัปเดตข้อมูลสรุปประจำวันหลังจากเพิ่มหรือลบรายการอาหาร
     */
    public function updateDailySummary($userId, $date)
    {
        // คำนวณแคลอรี่ที่บริโภคไปแล้ว
        $totalCaloriesConsumed = UserFoodLogs::where('user_id', $userId)
            ->where('date', $date)
            ->sum('total_calories');

        // ค้นหาข้อมูล goal_calories ของผู้ใช้
        $user = User::find($userId);
        $goalCalories = $user->goal_calories;

        // อัปเดตหรือสร้างข้อมูลสรุป
        $dailySummary = DailySummary::updateOrCreate(
            ['user_id' => $userId, 'date' => $date],
            [
                'total_calories_consumed' => $totalCaloriesConsumed,
                'goal_calories' => $goalCalories,
                'calories_difference' => $goalCalories - $totalCaloriesConsumed
            ]
        );

        return $dailySummary;
    }
}
