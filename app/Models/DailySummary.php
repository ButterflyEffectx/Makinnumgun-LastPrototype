<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use HasFactory;
class DailySummary extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'total_calories_consumed',
        'goal_calories',
        'calories_difference',
    ];

    /**
     * ความสัมพันธ์กับ User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
