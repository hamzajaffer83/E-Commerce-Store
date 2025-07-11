<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    protected $fillable = [
        'order_id',
        'product_variation_id',
        'quantity'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function productVariation()
    {
        return $this->belongsTo(ProductVariation::class);
    }

    public function product()
    {
        return $this->hasOneThrough(
            Product::class,
            ProductVariation::class,
            'id',
            'id',
            'product_variation_id',
            'product_id'
        );
    }

    public function productVariationImage()
    {
        return $this->hasOneThrough(
            VariationImage::class,
            ProductVariation::class,
            'id',
            'product_variation_id',
            'product_variation_id',
            'id'
        );
    }
}
