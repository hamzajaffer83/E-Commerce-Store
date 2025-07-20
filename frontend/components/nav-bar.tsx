import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBasketIcon, User, Menu } from "lucide-react"
import { type Category } from "@/types/data"
import NavigationLinks from "@/components/navigation-links"
import SidebarLink from "@/components/sidebar-link";
import NavUser from "@/components/nav-user";
import CartIcon from "@/components/cart-icon";

async function getCategory() {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
        console.error("Missing NEXT_PUBLIC_APP_URL environment variable");
        return [];
    }

    try {
        const res = await fetch(`${appUrl}/api/category`, {
            cache: 'force-cache',
            next: { revalidate: 3600 }, // Enables ISR: revalidates every 1 hour
        });

        if (!res.ok) {
            // console.error('Failed to LARAVEL:', await res.text());

            return [];
        }

        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

export async function Navbar() {
    const { data } : { data: Category[] } = await getCategory();

    return (
        <nav className="border-b">
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-4 py-4">
                <Link href="/" className="mt-2">
                    <Image src="/next.svg" alt="Logo" width={70} height={8} className="w-full h-[7px]" />
                </Link>
                <div className="hidden md:flex">
                    <NavigationLinks data={ data } />
                </div>
                <div className="">
                    <div className="hidden md:flex items-center cursor-pointer space-x-4">
                        <Search />
                        <CartIcon />
                        <NavUser />
                    </div>
                    <div className="md:hidden gap-2">
                        <SidebarLink data={ data } />
                    </div>
                </div>
            </div>
        </nav>
    )
}