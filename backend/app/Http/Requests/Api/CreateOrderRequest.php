<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "phone_no" => "required|string",
            "address" => "required|string|max:225",
            "city" => "required|string|max:55",
            "cart_id" => "nullable|exists:carts,id",

            "orderItems" => "sometimes|required|array",
            "orderItems.*.product_variation_id" => "required|exists:product_variations,id",
            "orderItems.*.quantity" => "required|integer|min:1",
        ];
    }
}
