import Link from "next/link"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Search, ShoppingBasketIcon, User, Menu } from "lucide-react"
import { type Category } from "@/types/data"
import NavigationLinks from "@/components/navigation-links"
import SidebarLink from "@/components/sidebar-link";

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
            console.error('Failed to fetch categories:', await res.text());
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
                    <Image src="/next.svg" alt="Logo" width={70} height={8} />
                </Link>
                <div className="hidden md:flex">
                    <NavigationLinks data={ data } />
                </div>
                <div className="">
                    <div className="hidden md:flex cursor-pointer gap-2">
                        <Search />
                        <div className="relative">
                            <ShoppingBasketIcon className="w-6 h-6" />
                            <div className="absolute -top-0 border right-0 transform translate-x-1/2 -translate-y-1/2 h-4 w-4 text-xs rounded-full bg-grey-800 text-white z-30">
                                0
                            </div>
                        </div>

                        <User />
                    </div>
                    <div className="md:hidden gap-2">
                        <SidebarLink data={ data } />
                    </div>
                </div>
            </div>
        </nav>
    )
}