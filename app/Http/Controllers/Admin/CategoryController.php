<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $query = Category::query();

        $categories = $query->where('parent_id', NULL)->orderBy('id', 'DESC')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/category/index', [
            'categories' => $categories,
            'per_page' => $perPage,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/category/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        Category::create([
            'name' => $validated['name'],
        ]);

        return redirect()->intended(route('admin.category.index', [], false))->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $category = Category::findOrFail($id);
        return Inertia::render('admin/category/edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $category->update([
            'name' => $validated['name'],
        ]);

        return redirect()->intended(route('admin.category.index', [], false))->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);

        $category->delete();

        return redirect()
            ->route('admin.category.index');
    }

    public function sub_index(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'per_page' => 'integer|min:1|max:100',
        ]);

        $perPage = $request->input('per_page', 10);

        $categories = Category::where('parent_id', $category->id)
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();



        return Inertia::render('admin/category/sub/index', [
            'categories' => $categories,
            'per_page' => $perPage,
            'parent_category' => $category
        ]);
    }

    public function sub_create(string $id)
    {
        $category = Category::findOrFail($id);

        return Inertia::render('admin/category/sub/create', [
            'parent_category' => $category
        ]);
    }

    public function sub_store(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        Category::create([
            'name' => $validated['name'],
            'parent_id' => $category->id,
        ]);

        return redirect()->intended(route('admin.category.sub.index', ['parent_id' => $category->id], false))->with('success', 'Sub Category created successfully.');
    }

    public function sub_edit(string $parentId, string $subCategoryId)
    {
        $category = Category::findOrFail($parentId);
        $subCategory = Category::findOrFail($subCategoryId);

        return Inertia::render('admin/category/sub/edit', [
            'parent_category' => $category,
            'sub_category' => $subCategory
        ]);
    }

    public function sub_update(Request $request, string $parentId, string $subCategoryId)
    {
        $category = Category::findOrFail($parentId);
        $subCategory = Category::findOrFail($subCategoryId);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $subCategory->id,
        ]);

        $subCategory->update([
            'name' => $validated['name'],
            'parent_id' => $category->id,
        ]);

        return redirect()->intended(route('admin.category.sub.index', ['parent_id' => $category->id], false))->with('success', 'Sub Category updated successfully.');
    }

    public function sub_destroy(string $parentId, string $subCategoryId)
    {
        $category = Category::findOrFail($parentId);
        $subCategory = Category::findOrFail($subCategoryId);

        $subCategory->delete();

        return redirect()
            ->route('admin.category.sub.index', ['parent_id' => $category->id]);
    }
}
