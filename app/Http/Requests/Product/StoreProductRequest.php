<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $common = [
            'title' => 'required|string|max:255',
            'cover_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:categories,id',

            // ✅ Multiple Images (optional)
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',

            // ✅ Social Links
            'social_link' => 'nullable|array',
            'social_link.*.platform' => 'required_with:social_link.*.url|string',
            'social_link.*.url' => 'required_with:social_link.*.platform|url',
        ];

        if ($this->type === 'simple') {
            return array_merge($common, [
                'sizes' => 'array',
                'color' => ['nullable','regex:/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
                'price' => 'required|numeric|min:0',
                'sale_price' => 'nullable|numeric|min:0',
                'quantity' => 'nullable|integer|min:0',
                'sale_start_at' => 'nullable|date|after_or_equal:today',
                'sale_end_at' => 'nullable|date|after:sale_start_at',
            ]);
        }

        if ($this->type === 'variable') {
            return array_merge($common, [
                'variants' => 'required|array|min:1',
                'variants.*.price' => 'nullable|numeric|min:0',
                'variants.*.sale_price' => 'nullable|numeric|min:0',
                'variants.*.quantity' => 'nullable|integer|min:0',
                'variants.*.size' => 'required|string',
                'variants.*.color' => ['required', 'regex:/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
                'price' => 'nullable|numeric|min:0',
                'sale_price' => 'nullable|numeric|min:0',
                'sale_start_at' => 'nullable|date|after_or_equal:today',
                'sale_end_at' => 'nullable|date|after:sale_start_at',
                'variants.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);
        }

        return [];
    }

}
