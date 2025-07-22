<?php

namespace App\Http\Controllers\SiteSetting;

use App\Http\Controllers\Controller;
use App\Models\WhatsAppSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WhatsappController extends Controller
{
    public function index()
    {
        return Inertia::render('site-settings/whatsapp/index', [
            'numbers' => WhatsAppSetting::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
        ]);

        WhatsAppSetting::create($request->only('name', 'phone', 'message'));

        return back()->with('success', 'WhatsApp number added');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:20',
            'message' => 'nullable|string',
        ]);

        $number = WhatsAppSetting::findOrFail($id);
        $number->update($validated);

        return back()->with('success', 'WhatsApp number updated successfully.');
    }

    public function setActive(WhatsAppSetting $whatsapp)
    {
        // Deactivate all others
        WhatsAppSetting::where('id', '!=', $whatsapp->id)->update(['is_active' => false]);

        // Activate selected
        $whatsapp->update(['is_active' => true]);

        return back();
    }

    public function destroy(WhatsAppSetting $whatsapp)
    {
        if ($whatsapp->is_active) {
            return back()->withErrors(['Cannot delete active number']);
        }

        $whatsapp->delete();

        return back()->with('success', 'Deleted successfully.');
    }


}
