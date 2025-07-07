<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CreateCartRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "session_id" => "nullable|string",
            "user_id" => "nullable|exists:users,id",

            "cartItem" => "nullable|array",
            "cartItem.*.product_id" => "required_with:cartItem|exists:products,id",
            "cartItem.*.quantity" => "required_with:cartItem|integer|min:1",
        ];
        
    }


}
