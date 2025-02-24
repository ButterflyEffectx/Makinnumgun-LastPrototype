<?php

// app/Models/Food.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    protected $fillable = [
        'name',
        'category_id',
        'calories',
        'protein',
        'carbs',
        'fats',
        'serving_size',
        'image'
    ];

    public function category()
    {
        return $this->belongsTo(catagory::class, 'catagory_id');
    }
}
