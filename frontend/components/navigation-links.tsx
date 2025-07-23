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
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function getContrastTextColor(bgColor: string) {
  if (!bgColor) return "text-black";
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "text-black" : "text-white";
}

function getHoverBg(bgColor: string) {
  if (!bgColor) return "hover:bg-gray-100";
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const alpha = 0.1;
  return `hover:bg-[rgba(${r},${g},${b},${alpha})]`;
}

export default function NavigationLinks({ data }: { data: Category[] }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const barColor = useSelector((state: RootState) => state.color.value) || "#ffffff";
  const textColorClass = getContrastTextColor(barColor);
  const hoverBgClass = getHoverBg(barColor);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const navLinkClass = (path: string) =>
    `px-4 py-2 rounded-md transition-colors duration-200 ${pathname === path ? "bg-white/50" : "bg-transparent active:none "
    } ${hoverBgClass} ${textColorClass}`;

  const isCategoryPath = pathname?.startsWith("/product/category");

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="flex items-center gap-2">
        {/* Home */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className="text-md">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Category Dropdown */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`px-4 py-2 flex gap-1 items-center cursor-pointer rounded-md transition-colors duration-200
    ${isCategoryPath || dropdownOpen ? "bg-white/30" : "bg-transparent hover:bg-white/10"}
    ${textColorClass}`}
          >
            Category
            {dropdownOpen ? (
              <ChevronDown className={`w-4 h-4 ml-1 ${textColorClass}`} />
            ) : (
              <ChevronUp className={`w-4 h-4 ml-1 ${textColorClass}`} />
            )}
          </button>

          {dropdownOpen && (
            <ul className="absolute top-full left-0 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 min-w-[200px] p-2">
              {data?.length ? (
                data.map((category) => (
                  <li key={category.id} className="relative group/category px-1 py-1">
                    <Link
                      href={`/product/category/${category.name}`}
                      className="block px-3 py-2 rounded text-black hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>

                    {category.children && category.children.length > 0 && (
                      <ul className="absolute top-0 bg-white dark:bg-gray-800 left-full ml-2 hidden group-hover/category:block rounded shadow-lg w-[200px] z-50">
                        {category.children.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/product/category/${sub.name}`}
                              className="block px-3 py-2 text-black hover:bg-gray-100"
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
          <NavigationMenuLink asChild className="text-md">
            <Link href="/order/track" className={navLinkClass("/order/track")}>
              Track Order
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
