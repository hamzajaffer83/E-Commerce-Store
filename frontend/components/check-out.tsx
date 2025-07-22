'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartItem } from "@/types/cart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import {getLocalStorageToken} from "@/lib/service";
import {clearCart} from "@/redux/cartSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';
const token = getLocalStorageToken();

// ✅ Zod Schema
const checkoutSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    totalPrice: number;
    cartItems: CartItem[];
};

export function CheckOut({open, onOpenChange, totalPrice, cartItems}: Props) {
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<CheckoutForm>({
        phone: '',
        address: '',
        city: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        setFormData((prev) => ({...prev, [id]: value}));
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const result = checkoutSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof CheckoutForm, string>> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof CheckoutForm;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }


        // ✅ If valid
        setErrors({});
        const dataToSend = {
            phone_no: formData.phone,
            address: formData.address,
            city: formData.city,
            cart_id: cartItems[0]?.cart_id,
        };

        if (token) {
            const response = await fetch(`${apiUrl}/api/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'ApiSecretKey': apiSecretKey,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.status === 201) {
                toast.success("Checkout successful!");
                dispatch(clearCart());
                onOpenChange(false);
            } else {
                const error = await response.json();
                toast.error(error.message || "Something went wrong during checkout.");
            }
        }
    };

    const getEffectivePrice = (item: CartItem): number => {
        const pv = item.product_variation;
        if (!pv) return 0;

        const now = new Date();

        const salePrice = parseFloat(pv.sale_price || '0');
        const regularPrice = parseFloat(pv.price || '0');

        const hasSalePrice = !isNaN(salePrice) && salePrice > 0;

        const saleStart = pv.sale_start_at ? new Date(pv.sale_start_at) : null;
        const saleEnd = pv.sale_end_at ? new Date(pv.sale_end_at) : null;

        let useSale = false;

        if (hasSalePrice) {
            if (!saleStart && !saleEnd) {
                useSale = true;
            } else if (saleStart && !saleEnd && now >= saleStart) {
                useSale = true;
            } else if (!saleStart && saleEnd && now <= saleEnd) {
                useSale = true;
            } else if (saleStart && saleEnd && now >= saleStart && now <= saleEnd) {
                useSale = true;
            }
        }

        return useSale ? salePrice : regularPrice;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full h-fit max-h-[90vh] overflow-y-auto py-3">
                <DialogHeader>
                    <DialogTitle><p className="text-2xl">Check Out</p></DialogTitle>
                </DialogHeader>

                {/* Cart Items */}
                <div className="flex flex-col gap-2 p-3 border-y-2">
                    {cartItems.map((item) => {
                        const price = getEffectivePrice(item);
                        return (
                            <div key={item.id}
                                 className="flex items-center gap-2 p-2 border-b-2 hover:bg-gray-200/90 cursor-pointer">
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
                                <div className="flex flex-col">
                                    <p className="text-sm">{item.product_variation?.product?.title}</p>
                                    {(() => {
                                        const pv = item.product_variation;
                                        const salePrice = parseFloat(pv?.sale_price || '0');
                                        const regularPrice = parseFloat(pv?.price || '0');

                                        const now = new Date();
                                        const saleStart = pv?.sale_start_at ? new Date(pv.sale_start_at) : null;
                                        const saleEnd = pv?.sale_end_at ? new Date(pv.sale_end_at) : null;

                                        const hasSalePrice = !isNaN(salePrice) && salePrice > 0;

                                        const useSale =
                                            hasSalePrice &&
                                            (
                                                (!saleStart && !saleEnd) ||
                                                (saleStart && !saleEnd && now >= saleStart) ||
                                                (!saleStart && saleEnd && now <= saleEnd) ||
                                                (saleStart && saleEnd && now >= saleStart && now <= saleEnd)
                                            );

                                        return useSale ? (
                                            <div className="flex gap-2 items-center">
                                                <p className="text-sm line-through text-red-500">${regularPrice.toFixed(2)}</p>
                                                <p className="text-sm font-semibold text-green-600">${salePrice.toFixed(2)}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-semibold">${regularPrice.toFixed(2)}</p>
                                        );
                                    })()}

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pricing Summary */}
                <div className="flex bg-gray-200/50 flex-col gap-2 p-3 rounded-md mt-4">
                    <div className="flex flex-col gap-1 pb-2 border-b-2">
                        <div className="flex justify-between">
                            <h1>Subtotal</h1>
                            <b>${totalPrice.toFixed(2)}</b>
                        </div>
                        <div className="flex justify-between">
                            <h1>Shipping</h1>
                            <b>Free</b>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <b>Total</b>
                        <b>${totalPrice.toFixed(2)}</b>
                    </div>
                </div>

                {/* Shipping Form */}
                <Card className="w-full py-0 border-none shadow-none mt-4">
                    <CardHeader>
                        <CardTitle className="text-center w-full">Enter The Shipping Detail Below</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number:</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="0000000000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        placeholder="Street address..."
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                    {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                                </div>
                                <div className="grid gap-2 mb-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        type="text"
                                        placeholder="City name..."
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                    {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full">
                                Check Out
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
