<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailySummary extends Model
{
    use HasFactory;

    /**
     * ตั้งชื่อตารางให้ตรงกับที่สร้างไว้ในไฟล์ migration
     */
    protected $table = 'daily_summary';

    /**
     * กำหนดฟิลด์ที่สามารถเพิ่มข้อมูลได้
     */
    protected $fillable = [
        'user_id',
        'date',
        'total_calories',
        'calories_diff'
    ];

    /**
     * กำหนดความสัมพันธ์กับตาราง users
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
