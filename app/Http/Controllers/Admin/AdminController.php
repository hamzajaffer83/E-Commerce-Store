<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItems;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();
        $totalOrders = Order::where('status', '!=', 'cancelled')->get();
        $totalRevenue = Order::where(function ($query) {
            $query->where('status', 'paid')
                ->orWhere('status', 'shipped');
        })
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('price');
        $pendingOrders = Order::where('status', 'pending')->get();
        return Inertia::render('admin/dashboard', [
            'totalProducts' => $totalProducts,
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'pendingOrders' => $pendingOrders
        ]);
    }

    public function updateOrderStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:shipped,cancelled,paid,pending',
        ]);

        $order = Order::findOrFail($id);

        $order->status = $validated['status'];
        $order->save();

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function allOrder(Request $request){
        $perPage = $request->input('per_page', 10);
        $query = Order::query();

        $allOrders = $query->orderBy('id', 'DESC')->paginate($perPage)->withQueryString();
        return Inertia::render('admin/order/index', [
            'allOrders' => $allOrders,
            'per_page' => $perPage,
        ]);
    }

    public function singleOrder(string $id){
        $order = Order::findOrFail($id);
        $order_items = OrderItems::where('order_id', $order->id)->with('productVariation', 'product', 'productVariationImage')->get();
        $user = User::where('id', $order->user_id)->first();
    
        return Inertia::render('admin/order/single', [
            'order' => $order,
            'order_items' => $order_items,
            'user' => $user,
        ]);
    }
}
