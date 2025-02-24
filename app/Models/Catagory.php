<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Catagory extends Model
{
    protected $table = 'catagory'; // ตั้งชื่อตาราง catagory ตามที่กำหนดใน migration

    protected $fillable = [
        'name'
    ];

    public function foods()
    {
        return $this->hasMany(Food::class, 'category_id');
    }
}
