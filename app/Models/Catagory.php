<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use HasFactory;

class Catagory extends Model
{
    protected $table = 'catagory';

    protected $fillable = [
        'name',
    ];

    public function foods()
    {
        return $this->hasMany(food::class, 'catagory_id');
    }
}
