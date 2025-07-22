'use client';

import {useEffect, useState} from "react";
import {toast} from "react-toastify"; // ✅ Toast
import {UserIcon} from "lucide-react";
import {clearLocalStorage, getLocalStorageUser} from "@/lib/service";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import type { User } from "@/types/data";

export default function NavUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = getLocalStorageUser();
        setUser(storedUser);
    }, []);

    const handleLogout = async () => {
        await clearLocalStorage();
        toast.success("Logged out successfully");
        window.location.reload();
    };

    return (
        <div className="">
            {!user && (
                <Link href="/login" className="">
                    <Button className="w-full sm:w-auto">Login</Button>
                </Link>
            )}
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                            <UserIcon className="w-6 h-6"/>
                            <span className="text-black dark:text-white md:hidden text-sm font-medium">
                                {user.name}
                              </span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            <span className="text-black dark:text-white hidden md:flex text-sm font-medium">
                                {user.name}
                              </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}
