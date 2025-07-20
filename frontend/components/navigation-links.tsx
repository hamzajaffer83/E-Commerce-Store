"use client"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { type Category } from "@/types/data";
import Link from "next/link";
import { useState } from "react";
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function NavigationLinks({ data }: { data: Category[] }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
  return <>
      <NavigationMenu className="" viewport={false}>
          <NavigationMenuList className="">
              <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/">Home</Link>
                  </NavigationMenuLink>
              </NavigationMenuItem>
              <div
                  className="relative group"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setTimeout(() => setDropdownOpen(false), 300) }
                  onClick={() => setDropdownOpen(false) }
              >
                  {/* Top Nav Button */}
                  <button className="px-4 py-2 flex gap-1 items-center cursor-pointer rounded-md">
                      Category
                      {dropdownOpen ? (
                          <ChevronDown className="w-4 h-4 ml-1" />
                      ) : (
                          <ChevronUp className="w-4 h-4 ml-1" />
                          )}
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                      <ul
                          onMouseEnter={() => setDropdownOpen(true)}
                          onMouseLeave={() => setTimeout(() => setDropdownOpen(false), 300)}
                          className="absolute top-full left-0 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 min-w-[200px] p-2"
                      >
                          {data ? data.map((category) => (
                              <li
                                  key={category.id}
                                  className="relative group/category px-1 py-1"
                              >
                                  <Link
                                      href={`/product/category/${category.name}`}
                                      className="block px-3 py-2 rounded "
                                      onClick={() => setDropdownOpen(false) }
                                  >
                                      {category.name}
                                  </Link>

                                  {/* Subcategory flyout */}
                                  {category.children && category.children.length > 0 && (
                                      <ul className="absolute top-0 bg-white dark:bg-gray-800 left-full ml-2 hidden group-hover/category:block rounded shadow-lg w-[200px] z-50">
                                          {category.children.map((sub) => (
                                              <li key={sub.id}>
                                                  <Link
                                                      href={`/product/category/${sub.name}`}
                                                      className="block px-3 py-2 "
                                                  >
                                                      {sub.name}
                                                  </Link>
                                              </li>
                                          ))}
                                      </ul>
                                  )}
                              </li>
                          )) :  (
                              <>No Category Found</>
                          )}
                      </ul>
                  )}
              </div>
              <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="#">Track Order</Link>
                  </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="#">Contact Us</Link>
                  </NavigationMenuLink>
              </NavigationMenuItem>
          </NavigationMenuList>
      </NavigationMenu>
  </>;
}