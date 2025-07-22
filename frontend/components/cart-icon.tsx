'use client';

import { ShoppingBasketIcon } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

export default function CartIcon({ setOpen }: { setOpen?: (open: boolean) => void }) {
    const cartItems = useAppSelector((state) => state.cart.cartItem);
    const itemCount = cartItems.length;

    const handleClick = () => {
        if (setOpen) setOpen(false);
    };

    return (
        <Link
            href="/cart"
            onClick={handleClick}
            className="relative w-full p-2 sm:p-0 rounded-md sm:rounded-none bg-gray-800 sm:bg-transparent text-white sm:text-black sm:w-fit border sm:border-none"
        >
            <div className="flex items-center gap-2 sm:gap-0">
                <ShoppingBasketIcon className="w-6 h-6" />
                <p className="block sm:hidden">Cart</p>
            </div>

            {itemCount > 0 && (
                <div className="absolute -top-1 right-0 transform translate-x-1/2 -translate-y-1/2 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-red-600 text-white z-30">
                    {itemCount}
                </div>
            )}
        </Link>
    );
}
