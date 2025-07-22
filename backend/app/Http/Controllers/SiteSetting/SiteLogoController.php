<?php

namespace App\Http\Controllers\SiteSetting;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\LogoCategory;
use App\Models\SiteLogo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SiteLogoController extends Controller
{
    public function index()
    {
        $logos = SiteLogo::with('categories')->get();

        // Categories with assigned logo id (or null)
        $categories = Category::with('logos:id')->get()->map(function ($cat) {
            // One category only has one logo, get first if exists
            $assignedLogoId = $cat->logos->first()?->id ?? null;
            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'assigned_logo_id' => $assignedLogoId,
            ];
        });

        return Inertia::render('site-settings/site-logo/index', [
            'logos' => $logos,
            'categories' => $categories,
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'required|image|max:2048',
        ]);

        $path = $request->file('logo')->store('logos', 'public');

        SiteLogo::create([
            'name' => $request->name,
            'logo' => $path,
        ]);

        return redirect()->back()->with('success', 'Logo uploaded!');
    }

    public function assignCategory(Request $request, SiteLogo $logo)
    {
        $request->validate([
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        // Remove these categories from all other logos except current one
        LogoCategory::whereIn('category_id', $request->category_ids)
            ->where('logo_id', '!=', $logo->id)
            ->delete();

        // Sync categories to current logo (attach/update pivot)
        $logo->categories()->sync($request->category_ids);

        return back()->with('success', 'Categories updated.');
    }


    public function destroy($id)
    {
        $logo = SiteLogo::findOrFail($id);

        Storage::disk('public')->delete($logo->logo);
        $logo->delete();

        return redirect()->back()->with('success', 'Logo deleted.');
    }
}
