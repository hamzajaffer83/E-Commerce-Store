<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariation extends Model
{
    protected $fillable = ['product_id', 'size', 'color', 'price', 'sale_price', 'quantity'];

    protected $casts = [
        'sale_end_at' => 'datetime',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function images()
    {
        return $this->hasMany(VariationImage::class);
    }

    public function isOnSale()
    {
        return $this->sale_price !== null &&
            $this->sale_end_at !== null &&
            now()->lessThan($this->sale_end_at);
    }
}
