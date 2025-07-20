<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItems extends Model
{
    protected $fillable = [
        'cart_id',
        'product_variation_id',
        'quantity',
    ];

    // Each cart item belongs to a cart
    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id');
    }
}
