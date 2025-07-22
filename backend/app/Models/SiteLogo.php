<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteLogo extends Model
{
    protected $fillable = ['name', 'logo'];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'logo_categories', 'logo_id', 'category_id');
    }
}
