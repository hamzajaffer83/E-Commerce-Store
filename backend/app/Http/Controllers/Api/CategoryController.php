<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('parent_id', NULL)->with('children')->orderBy('id', 'DESC')->get();

        if ($categories) {
            return response()->json([
                'status' => 'success',
                'data' => $categories,
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No Category found.'
            ], 404);
        }
    }

    public function subIndex(string $category)
    {
        $parentCategory = Category::where('name', $category)->first();
        if ($parentCategory) {
            $categories = Category::where('parent_id', $parentCategory->id)->orderBy('id', 'DESC')->get();

            if ($categories) {
                return response()->json([
                    'status' => 'success',
                    'data' => $categories,
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No Sub Category found of' . $category
                ], 404);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No Category found of name '. $category,
            ], 404);
        }
    }
}
