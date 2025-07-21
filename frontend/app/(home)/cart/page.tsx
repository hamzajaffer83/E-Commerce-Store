'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    removeCartItem,
    updateCartItem,
    clearCart,
} from '@/redux/cartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';

export default function Cart() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.cartItem);
    const user_id = useAppSelector((state) => state.cart.user_id);
    const session_id = useAppSelector((state) => state.cart.session_id);
    const cartId = cartItems.length > 0 ? cartItems[0].cart_id : null;

    // ✅ Update Quantity
    const handleQuantityChange = async (id: number, quantity: number) => {
        if (quantity < 1) return;

        // @ts-ignore
        dispatch(updateCartItem({ id, quantity }));

        const res = await fetch(`${apiUrl}/api/cart/item/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'ApiSecretKey': apiSecretKey,
            },
            body: JSON.stringify({ quantity }),
        });
    };

    // 🗑 Remove Item
    const handleRemove = async (id: number) => {

        dispatch(removeCartItem(id));
        const res = await fetch(`${apiUrl}/api/cart/item/${id}`, {
            method: 'DELETE',
            headers: {
                'ApiSecretKey': apiSecretKey,
            }
        });
        toast.success('Cart item removed successfully');
    };

    // 🧼 Clear Entire Cart
    const handleClearCart = async () => {
        if (!cartId) return;

        const res = await fetch(`${apiUrl}/api/cart/${cartId}`, {
            method: 'DELETE',
            headers: {
                'ApiSecretKey': apiSecretKey,
            }
        });

        const json = await res.json();
        if (json.message === 'Cart cleared successfully') {
            dispatch(clearCart());
            toast.success(json.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
                {cartItems.length > 0 && (
                    <Button onClick={handleClearCart} variant="destructive" size="sm">
                        <XCircle className="w-4 h-4 mr-2" /> Clear Cart
                    </Button>
                )}
            </div>

            {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.product_variation_id}
                            className="flex items-center justify-between border rounded-lg p-4 shadow-sm"
                        >
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">Product #{item.product_variation_id}</h3>
                                <div className="flex items-center mt-2 space-x-2">
                                    <span>Quantity:</span>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        className="w-20"
                                        onChange={(e) =>
                                            // @ts-ignore
                                            handleQuantityChange(item.id, parseInt(e.target.value))
                                        }
                                    />
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                // @ts-ignore
                                onClick={() => handleRemove(item.id)}
                            >
                                <Trash2 className="w-5 h-5 text-red-500" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
