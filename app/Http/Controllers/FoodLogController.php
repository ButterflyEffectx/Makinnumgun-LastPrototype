<?php

namespace App\Http\Controllers;

use App\Models\foods;
use App\Models\FoodLog;
use Illuminate\Http\Request;
use App\Models\DailySummary;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FoodLogController extends Controller
{
    /**
     * บันทึกข้อมูลการบริโภคอาหาร
     */
    public function store(Request $request)
    {
        $userId = Auth::id();
        $updatedDates = []; // เก็บวันที่ที่มีการอัพเดท

        foreach ($request->foods as $food) {
            FoodLog::create([
                'user_id' => $userId,
                'food_id' => $food['food_id'],
                'date' => $food['date'],
            ]);

            // เก็บวันที่ที่มีการเปลี่ยนแปลง (ไม่ซ้ำกัน)
            if (!in_array($food['date'], $updatedDates)) {
                $updatedDates[] = $food['date'];
            }
        }

        // คำนวณและบันทึกสรุปเฉพาะวันที่มีการเปลี่ยนแปลง
        foreach ($updatedDates as $date) {
            $this->calculateAndSaveDailySummary($date, $userId);
        }

        // ให้เว็บรีเฟรชโดยการ redirect กลับไปที่หน้าเดิม
        return redirect()->back()->with('message', 'เพิ่มรายการอาหารเรียบร้อยแล้ว');
    }

    /**
     * คำนวณและบันทึกสรุปแคลอรี่รายวัน
     */
    private function calculateAndSaveDailySummary($date, $userId)
{
    // ดึงข้อมูล user เพื่อหา goal_calories
    $user = Auth::user();

    // คำนวณผลรวมแคลอรี่ - ปรับปรุงใหม่
    $totalCalories = FoodLog::join('foods', 'food_log.food_id', '=', 'foods.id')
        ->where('food_log.user_id', $userId)
        ->whereDate('food_log.date', $date)
        ->sum('foods.calories');

    // คำนวณผลต่างของแคลอรี่
    $caloriesDiff = $user->goal_calories - $totalCalories;

    // อัพเดทหรือสร้างข้อมูลใหม่ในตาราง daily_summary
    DailySummary::updateOrCreate(
        ['user_id' => $userId, 'date' => $date],
        [
            'total_calories' => $totalCalories,
            'calories_diff' => $caloriesDiff
        ]
    );
}

    // เพิ่มเมธอดอื่นๆ ตามความเหมาะสม...
}
