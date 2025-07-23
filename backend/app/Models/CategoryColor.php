<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryColor extends Model
{
    protected $fillable = [ 'category_id', 'theme_color' ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
