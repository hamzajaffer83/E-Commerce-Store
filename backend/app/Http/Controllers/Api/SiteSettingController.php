<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryColor;
use App\Models\LogoCategory;
use App\Models\SiteSocialLink;
use App\Models\WhatsAppSetting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function whatsapp()
    {
        $whatsapp = WhatsAppSetting::where('is_active', 1)->first();

        if (!$whatsapp) {
            return response()->json([
                'message' => 'No active whatsapp found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Active Message Found.',
            'data' => $whatsapp,
        ], 200);
    }

    public function logo(string $name)
    {
        $category = Category::where('name', $name)->first();

        if (!$category) {
            return response()->json([
                'message' => 'No category found of name ' . $name,
            ], 404);
        }

        $logoItem = LogoCategory::where('category_id', $category->id)->with('logo')->first();

        if (!$logoItem) {
            return response()->json([
                'message' => 'No Logo Item found of Category Name ' . $name,
            ], 404);
        }

        return response()->json([
            'message' => 'Logo Found.',
            'logo' => $logoItem->logo->logo,
        ], 200);

    }

    public function footerLink()
    {
        $link = SiteSocialLink::all();

        if (!$link) {
            return response()->json([
                'message' => 'No link found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Link Found.',
            'data' => $link,
        ], 200);
    }

    public function colorTheme(string $name)
    {
        $category = Category::where('name', $name)->firstOrFail();

        if (!$category) {
            return response()->json([
                'message' => 'No category found of given name: ' . $name
            ], 404);
        }

        $colorTheme = CategoryColor::where('category_id', $category->id)->firstOrFail();

        if(!$colorTheme)
        {
            return response()->json([
                'message' => 'No Color Theme Found of Category: ' . $name
            ], 404);
        }

        return response()->json([
            'message' => 'Color Theme Found.',
            'color' => $colorTheme->theme_color,
        ], 200);
    }
}
