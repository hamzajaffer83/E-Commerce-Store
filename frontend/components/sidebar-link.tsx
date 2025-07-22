'use client';

import Link from "next/link";
import type {Category} from "@/types/data";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {Menu} from "lucide-react";
import Image from "next/image";
import {useState} from "react";
import NavUser from "@/components/nav-user";
import CartIcon from "@/components/cart-icon";

export default function SidebarLink({data}: { data: Category[] }) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
                <Menu className="w-6 h-6 cursor-pointer" onClick={() => setOpen(true)}/>
            </SheetTrigger>
            <SheetContent className="md:w-2/6 flex flex-col h-full" side="left">
                <SheetHeader>
                    <SheetTitle>
                        <Link href="/">
                            <Image src="/next.svg" alt="Logo" width={70} height={8} />
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col justify-between h-full">
                    {/* Top links and categories */}
                    <div className="flex gap-2 flex-col space-y-3 px-3">
                        <Link href="/" onClick={() => setOpen(false)}>Home</Link>

                        <Accordion type="single" collapsible>
                            <AccordionItem value="categories">
                                <AccordionTrigger>Category</AccordionTrigger>
                                <AccordionContent>
                                    <Accordion type="single" collapsible>
                                        {data && data.length > 0 ? (
                                            data.map((category: Category) => (
                                                <AccordionItem key={category.id} value={`item-${category.id}`}>
                                                    <AccordionTrigger>
                                                        <Link
                                                            onClick={() => setOpen(false)}
                                                            href={`/product/category/${category.name}`}
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    </AccordionTrigger>
                                                    {category.children.map((sub) => (
                                                        <AccordionContent key={sub.id}>
                                                            <Link
                                                                onClick={() => setOpen(false)}
                                                                href={`/product/category/${sub.name}`}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        </AccordionContent>
                                                    ))}
                                                </AccordionItem>
                                            ))
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                No Category Found
                                            </div>
                                        )}
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <Link href="/order/track" className="pb-3" onClick={() => setOpen(false)}>Track Order</Link>
                    </div>

                    {/* NavUser at bottom */}
                    <div className="flex flex-col gap-2 p-3 border-t mt-4">
                        <CartIcon />
                        <NavUser />
                    </div>
                </div>
            </SheetContent>

        </Sheet>
    );
}
