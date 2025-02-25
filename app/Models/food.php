<?php

// app/Models/Food.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{

    protected $table = 'foods';
    protected $fillable = [
        'name',
        'catagory_id',
        'calories',
        'protein',
        'carbs',
        'fats',
        'serving_size',
        'image'
    ];

    public function category()
    {
        return $this->belongsTo(Catagory::class, 'catagory_id');
    }
}
