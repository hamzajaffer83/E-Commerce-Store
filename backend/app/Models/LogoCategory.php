<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogoCategory extends Model
{
    protected $fillable = [ 'logo_id', 'category_id'];

    public function logo()
    {
        return $this->belongsTo(SiteLogo::class, 'logo_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

}
