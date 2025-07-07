<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreateOrderRequest;
use App\Models\CartItems;
use App\Models\Order;
use App\Models\OrderItems;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(CreateOrderRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();
            $price = 0;

            $order = Order::create([
                'user_id' => $user->id,
                'price' => 0,
                'status' => 'pending',
                'phone_no' => $request->phone_no,
                'address' => $request->address,
                'city' => $request->city
            ]);

            $items = [];

            if ($request->has('orderItems')) {
                $items = $request->orderItems;
            } elseif ($request->has('cart_id')) {
                $items = CartItems::where('cart_id', $request->cart_id)->get();
            }

            foreach ($items as $item) {
                $product = ProductVariation::find($item['product_variation_id']);
                if (!$product)
                    continue;

                OrderItems::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_variation_id'],
                    'quantity' => $item['quantity'],
                ]);

                $price += $product->price * $item['quantity'];

                if ($item instanceof CartItems) {
                    $item->delete();
                }
            }

            $order->update(['price' => $price]);

            DB::commit();
            return response()->json([
                'message' => 'Order Create Successfully',
                'data' => $order->load('orderItems')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $orders = Order::where('user_id', $user->id)->get();
        if ($orders) {
            return response()->json([
                'data' => $orders->load('orderItems'),
                'message' => 'Here is a list of all orders belong to you',
            ], 200);
        } else {
            return response()->json(['error' => 'No Order Found.'], 404);
        }
    }

    public function cancel(string $orderId)
    {
        $order = Order::findOrFail($orderId);
        if ($order) {
            $order->update([
                'status' => 'cancel',
            ]);
            return response()->json(['message' => 'Order cancel Successfully'], 200);
        } else {
            return response(['error' => 'No order found.'], 404);
        }
    }

    public function show(string $orderId)
    {
        $order = Order::findOrFail($orderId);
        if ($order) {
            return response()->json([
                'message' => 'Order cancel Successfully',
                'data' => $order->load('orderItems'),
            ], 200);
        } else {
            return response(['error' => 'No order found.'], 404);
        }
    }
}
