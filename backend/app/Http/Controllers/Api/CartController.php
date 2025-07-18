<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreateCartRequest;
use App\Models\Cart;
use App\Models\CartItems;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(string $userIdOrSessionId)
    {
        // Find Cart by session_id or user_id
        $cart = Cart::where('user_id', $userIdOrSessionId)->orWhere('session_id', $userIdOrSessionId)->first();

        if ($cart) {
            return response()->json([
                "message" => 'Cart Created Successfully',
                "data" => $cart->load("items"),
            ], 200);
        } else {
            return response()->json([
                "error" => 'Cart not found',
            ], 404);
        }
    }

    // Create or Update Cart
    public function createOrUpdate(CreateCartRequest $request)
    {
        if ($request->has('session_id') && $request->has('user_id')) {
            return response()->json(['error' => 'Either session_id or user_id is required'], 422);
        }

        $cart = null;

        // 1. Try to find cart by session_id
        if ($request->has('session_id')) {
            $cart = Cart::where('session_id', $request->session_id)->first();
        }

        // 2. If not found, try to find by user_id
        if (!$cart && $request->has('user_id')) {
            $cart = Cart::where('user_id', $request->user_id)->first();
        }

        // 3. If no existing cart, create new
        if (!$cart) {
            $data = [];

            if ($request->has('user_id')) {
                $data['user_id'] = $request->user_id;
            } elseif ($request->has('session_id')) {
                $data['session_id'] = $request->session_id;
            } else {
                return response()->json(['error' => 'No session_id or user_id provided'], 400);
            }
            $cart = Cart::create($data);
        }

        // 4. Add or update cart items
        if ($request->has('cartItem') && is_array($request->cartItem)) {
            foreach ($request->cartItem as $item) {
                if (!isset($item['product_variation_id']) || !isset($item['quantity'])) {
                    continue; // Skip invalid entries
                }

                // Update if product already exists, otherwise create
                CartItems::updateOrCreate(
                    [
                        'cart_id' => $cart->id,
                        'product_variation_id' => $item['product_variation_id'],
                    ],
                    [
                        'quantity' => $item['quantity'],
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'Cart created or updated successfully',
            'data' => $cart->load('items'),
        ], 201);
    }

    // Update Cart Item Quantity
    public function updateItem(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItems::find($id);

        if (!$cartItem) {
            return response()->json([
                'error' => 'Cart item not found'
            ], 404);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return response()->json([
            'message' => 'Cart item updated successfully',
            'cartItem' => $cartItem,
        ], 200);
    }

    // Remove specific Cart Item
    public function removeItem($id)
    {
        $cartItem = CartItems::find($id);

        if (!$cartItem) {
            return response()->json([
                'error' => 'Cart item not found'
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'message' => 'Cart item removed successfully',
        ], 200);
    }

    // Clear Entire Cart Items
    public function clear($userIdOrSessionId)
    {
        $cart = Cart::where('user_id', $userIdOrSessionId)
            ->orWhere('session_id', $userIdOrSessionId)
            ->first();

        if (!$cart) {
            return response()->json([
                'error' => 'Cart not found'
            ], 404);
        }

        // Delete all cart items
        $cart->items()->delete();

        return response()->json([
            'message' => 'Cart cleared successfully',
        ], 200);
    }
}