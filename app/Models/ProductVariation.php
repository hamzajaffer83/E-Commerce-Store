<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariation extends Model
{
    protected $fillable = ['product_id', 'sizes', 'color', 'price', 'sale_price', 'sale_start_at', 'sale_end_at' , 'quantity', 'sku'];

    protected $casts = [
        'sizes' => 'array',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function images()
    {
        return $this->hasMany(VariationImage::class);
    }
}
