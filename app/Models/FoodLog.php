<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodLog extends Model
{
    use HasFactory;

    /**
     * ตั้งชื่อตารางให้ตรงกับที่สร้างไว้ในไฟล์ migration
     */
    protected $table = 'food_log';

    /**
     * กำหนดฟิลด์ที่สามารถเพิ่มข้อมูลได้
     */
    protected $fillable = [
        'user_id',
        'food_id',
        'date',
    ];

    /**
     * กำหนดความสัมพันธ์กับตาราง users
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * กำหนดความสัมพันธ์กับตาราง foods
     */
    public function food()
    {
        return $this->belongsTo(foods::class);
    }
}
