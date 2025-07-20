'use client';

import { ShoppingBasketIcon } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link"

export default function CartIcon() {
    const cartItems = useAppSelector((state) => state.cart.cartItem);
    const itemCount = cartItems.length;

    return (
        <Link href="/cart" className="relative">
            <ShoppingBasketIcon className="w-6 h-6" />
            {itemCount > 0 && (
                <div className="absolute -top-0 right-0 transform translate-x-1/2 -translate-y-1/2 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-gray-800 text-white z-30">
                    {itemCount}
                </div>
            )}
        </Link>
    );
}

