<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSocialLink extends Model
{
    protected $fillable = [
        'product_id',
        'platform',
        'url',
    ];

    public function product()
{
    return $this->belongsTo(Product::class);
}
}
