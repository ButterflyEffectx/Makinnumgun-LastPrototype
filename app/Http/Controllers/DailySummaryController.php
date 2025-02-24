<?php

namespace App\Http\Controllers;

use App\Models\FoodLog;
use App\Models\DailySummary;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DailySummaryController extends Controller
{
    /**
     * คำนวณและบันทึกสรุปแคลอรี่รายวัน
     *
     * @param string|null $date วันที่ต้องการคำนวณ (ถ้าไม่ระบุจะใช้วันปัจจุบัน)
     * @param int|null $userId ID ของผู้ใช้ (ถ้าไม่ระบุจะใช้ผู้ใช้ที่ล็อกอินอยู่)
     * @return DailySummary
     */
    public function calculateAndSaveDailySummary($date = null, $userId = null)
    {
        // ถ้าไม่ระบุวันที่ ให้ใช้วันปัจจุบัน
        $date = $date ? Carbon::parse($date)->toDateString() : Carbon::today()->toDateString();

        // ถ้าไม่ระบุ userId ให้ใช้ ID ของผู้ใช้ที่ล็อกอินอยู่
        $userId = $userId ?? Auth::id();

        // ดึงข้อมูล user เพื่อหา goal_calories
        $user = User::findOrFail($userId);

        // คำนวณผลรวมแคลอรี่
        $totalCalories = FoodLog::join('foods', 'food_log.food_id', '=', 'foods.id')
            ->where('food_log.user_id', $userId)
            ->whereDate('food_log.date', $date)
            ->sum('foods.calories');

        // คำนวณผลต่างของแคลอรี่
        $caloriesDiff = $user->goal_calories - $totalCalories;

        // อัพเดทหรือสร้างข้อมูลใหม่ในตาราง daily_summary
        $dailySummary = DailySummary::updateOrCreate(
            ['user_id' => $userId, 'date' => $date],
            [
                'total_calories' => $totalCalories,
                'calories_diff' => $caloriesDiff
            ]
        );

        return $dailySummary;
    }
}
