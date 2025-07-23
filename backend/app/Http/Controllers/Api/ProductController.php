<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('variations.images', 'images', 'socialLinks')->paginate(50);

        if ($products->isNotEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No products found.'
            ], 404);
        }
    }

    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)->with('variations.images', 'images', 'socialLinks')->first();

        if ($product) {
            return response()->json([
                'status' => 'success',
                'data' => $product
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No product found of "' . $slug . '" slug',
            ], 404);
        }
    }

    public function category(string $category)
    {
        $fetchCategory = Category::where('name', $category)->first();

        if($fetchCategory) {
            $product = Product::where('category_id', $fetchCategory->id)
            ->orWhere('sub_category_id', $fetchCategory->id)
            ->with('variations', 'images', 'socialLinks')
            ->paginate(50);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No Category Or Sub Category found of name '. $category,
            ], 404);
        }

        if ($product) {
            return response()->json([
                'status' => 'success',
                'data' => $product
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No product found of "' . $category . '" category Or Sub Category',
            ], 404);
        }
    }
}
