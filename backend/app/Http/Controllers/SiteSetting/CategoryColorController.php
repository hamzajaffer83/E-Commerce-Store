<?php

namespace App\Http\Controllers\SiteSetting;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryColor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryColorController extends Controller
{
    public function index()
    {
        $themes = CategoryColor::with('category')->get();
        $categories = Category::all();
        return Inertia::render('site-settings/category-theme/index', [
            'themes' => $themes,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'theme_color' => 'required|string|max:20',
        ]);

        CategoryColor::create($data);
        return back()->with('success', 'Theme created');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'theme_color' => 'required|string|max:20',
        ]);

        $theme = CategoryColor::findOrFail($id);
        $theme->update($data);
        return back()->with('success', 'Theme updated');
    }

    public function destroy($id)
    {
        CategoryColor::destroy($id);
        return back()->with('success', 'Theme deleted');
    }
}
