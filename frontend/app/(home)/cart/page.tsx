'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    removeCartItem,
    updateCartItem,
    clearCart,
} from '@/redux/cartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, XCircle, BaggageClaim } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState, useMemo } from 'react';
import { CheckOut }  from "@/components/check-out";
import { getLocalStorageToken } from '@/lib/service';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';
const token = getLocalStorageToken();

export default function Cart() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.cartItem);
    const cartId = cartItems.length > 0 ? cartItems[0].cart_id : null;
    const [openCheckOut, setOpenCheckOut] = useState<boolean>(false);

    // ✅ Determine the correct price
    const getEffectivePrice = (item: any) => {
        const pv = item.product_variation || {};
        const now = new Date();

        const salePrice = parseFloat(pv.sale_price || '0');
        const price = parseFloat(pv.price || '0');

        const hasSalePrice = !isNaN(salePrice) && salePrice > 0;

        const saleStart = pv.sale_start_at ? new Date(pv.sale_start_at) : null;
        const saleEnd = pv.sale_end_at ? new Date(pv.sale_end_at) : null;

        let useSalePrice = false;

        if (hasSalePrice) {
            if (!saleStart && !saleEnd) {
                useSalePrice = true;
            } else if (saleStart && !saleEnd && now >= saleStart) {
                useSalePrice = true;
            } else if (!saleStart && saleEnd && now <= saleEnd) {
                useSalePrice = true;
            } else if (saleStart && saleEnd && now >= saleStart && now <= saleEnd) {
                useSalePrice = true;
            }
        }

        return useSalePrice ? salePrice : price;
    };

    // ✅ Total Price Calculation
    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const price = getEffectivePrice(item);
            return total + price * item.quantity;
        }, 0);
    }, [cartItems]);

    // ✅ Update Quantity
    const handleQuantityChange = async (id: number, quantity: number) => {
        if (quantity < 1) return;
        dispatch(updateCartItem({
            id, quantity,
            cart_id: 0,
            product_variation_id: 0
        }));
        await fetch(`${apiUrl}/api/cart/item/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'ApiSecretKey': apiSecretKey,
            },
            body: JSON.stringify({ quantity }),
        });
    };

    const handleRemove = async (id: number) => {
        dispatch(removeCartItem(id));
        await fetch(`${apiUrl}/api/cart/item/${id}`, {
            method: 'DELETE',
            headers: {
                'ApiSecretKey': apiSecretKey,
            }
        });
        toast.success('Cart item removed successfully');
    };

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
            </div>

            {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => {
                        const price = getEffectivePrice(item);
                        const original = parseFloat(item.product_variation?.price || '0');
                        const isOnSale = price < original;

                        return (
                            <div
                                key={item.product_variation_id}
                                className="flex items-center justify-between border rounded-lg p-2 md:p-4 shadow-sm"
                            >
                                <div className="flex flex-1 gap-4">
                                    {item.product_variation?.images ? (
                                        <img
                                            className="w-20 h-20 object-cover rounded"
                                            src={`${apiUrl}/storage/${item.product_variation?.images.image_path || item.product_variation?.product?.cover_image}`}
                                            alt="Product"
                                        />
                                        ) : (
                                        <img
                                            className="w-20 h-20 object-cover rounded"
                                            src={`${apiUrl}/storage/${item.product_variation?.product?.cover_image}`}
                                            alt="Product"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            Product #{item.product_variation_id}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Price:
                                            {isOnSale ? (
                                                <>
                                                    <span className="line-through ml-2 text-red-500">
                                                        ${original.toFixed(2)}
                                                    </span>
                                                    <span className="ml-2 font-bold text-green-600">
                                                        ${price.toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="ml-2">
                                                    ${price.toFixed(2)}
                                                </span>
                                            )}
                                        </p>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <span>Qty:</span>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={item.product_variation?.quantity || 0}
                                                value={item.quantity}
                                                className="w-20"
                                                onChange={(e) =>
                                                    handleQuantityChange(item.id, parseInt(e.target.value))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemove(item.id)}
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}

            {cartItems.length > 0 && (
                <>
                    <div className="flex justify-end mt-6">
                        <p className="text-lg font-semibold">
                            Total: ${totalPrice.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 gap-2">
                        <Button onClick={handleClearCart} variant="destructive" className="w-1/2" size="sm">
                            <XCircle className="w-4 h-4 mr-2" /> Clear Cart
                        </Button>
                        <Button onClick={() => setOpenCheckOut(true)} className={`w-1/2 ${token ? '' : 'pointer-events-none opacity-50'}`} size="sm">
                            <BaggageClaim className="w-4 h-4 mr-2" /> Check Out
                        </Button>
                    </div>
                </>
            )}

            {openCheckOut && (
                <CheckOut open={openCheckOut} onOpenChange={setOpenCheckOut} totalPrice={totalPrice} cartItems={cartItems} />
            )}
        </div>
    );
}
