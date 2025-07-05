<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['title', 'slug', 'description', 'cover_image', 'category_id', 'sub_category_id', 'type'];

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }
}
