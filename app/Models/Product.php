<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['title', 'slug', 'description', 'cover_image'];

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }
}
