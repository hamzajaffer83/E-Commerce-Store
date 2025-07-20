<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'status'
    ];

    //One Cart has many cart items
    public function items(){
        return $this->hasMany(CartItems::class);
    }
}
