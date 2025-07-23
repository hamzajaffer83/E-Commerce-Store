"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { type Category } from "@/types/data";
import Link from "next/link";
import { useState, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function NavigationLinks({ data }: { data: Category[] }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200); // small delay to allow cursor movement
  };

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {/* Home */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Category Dropdown */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Trigger */}
          <button className="px-4 py-2 flex gap-1 items-center cursor-pointer rounded-md">
            Category
            {dropdownOpen ? (
              <ChevronDown className="w-4 h-4 ml-1" />
            ) : (
              <ChevronUp className="w-4 h-4 ml-1" />
            )}
          </button>

          {/* Dropdown Content */}
          {dropdownOpen && (
            <ul className="absolute top-full left-0 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 min-w-[200px] p-2">
              {data?.length ? (
                data.map((category) => (
                  <li key={category.id} className="relative group/category px-1 py-1">
                    <Link
                      href={`/product/category/${category.name}`}
                      className="block px-3 py-2 rounded"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>

                    {/* Subcategories */}
                    {category.children && category.children.length > 0 && (
                      <ul className="absolute top-0 bg-white dark:bg-gray-800 left-full ml-2 hidden group-hover/category:block rounded shadow-lg w-[200px] z-50">
                        {category.children.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/product/category/${sub.name}`}
                              className="block px-3 py-2"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-500">No Categories Found</li>
              )}
            </ul>
          )}
        </div>

        {/* Track Order */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/order/track">Track Order</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
