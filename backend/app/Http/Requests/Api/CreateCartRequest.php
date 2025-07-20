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
            'user_id' => 'required_without:session_id|nullable|exists:users,id',
            'session_id' => 'required_without:user_id|nullable|string',

            "cartItem" => "nullable|array",
            "cartItem.*.product_variation_id" => "required_with:cartItem|exists:product_variations,id",
            "cartItem.*.quantity" => "required_with:cartItem|integer|min:1",
        ];

    }


}
