<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Catagory;

class UserFoodLogs extends Model
{
    protected $fillable = [
        'user_id',
        'food_id',
        'catagory_id',
        'servings',
        'total_calories',
        'date'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ความสัมพันธ์กับ Food
     */
    public function food()
    {
        return $this->belongsTo(Food::class);
    }

    /**
     * ความสัมพันธ์กับ Category
     */
    public function category()
    {
        return $this->belongsTo(Catagory::class, 'catagory_id');
    }
}
