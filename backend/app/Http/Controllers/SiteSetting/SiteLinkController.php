<?php

namespace App\Http\Controllers\SiteSetting;

use App\Http\Controllers\Controller;
use App\Models\SiteSocialLink;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiteLinkController extends Controller
{
    public function index()
    {
        $links = SiteSocialLink::all(); // assumes you have a SiteLink model/table
        return Inertia::render('site-settings/social-links/index', [
            'links' => $links,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|url',
        ]);

        SiteSocialLink::create($validated);

        return redirect()->back()->with('success', 'Link added successfully!');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|url',
        ]);

        $siteLink = SiteSocialLink::findOrFail($id);
        $siteLink->update($validated);

        return redirect()->back()->with('success', 'Link updated successfully!');
    }

    public function destroy($id)
    {
        $link = SiteSocialLink::findOrFail($id);
        $link->delete();

        return redirect()->back()->with('success', 'Link deleted successfully.');
    }
}
