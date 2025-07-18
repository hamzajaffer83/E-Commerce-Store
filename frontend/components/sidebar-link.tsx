'use client'

import Link from "next/link"
import type { Category } from "@/types/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function SidebarLink({data}: { data: Category[] }) {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
                <Menu className="w-6 h-6 cursor-pointer" onClick={() => setOpen(true)}/>
            </SheetTrigger>
            <SheetContent className="md:w-2/6" side="left">
                <SheetHeader className="">
                    <SheetTitle>
                        <Link href="/" className="">
                            <Image src="/next.svg" alt="Logo" width={70} height={8}/>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex gap-2 flex-col space-y-3 px-3">
                    <Link href="/" onClick={() => setOpen(false)}>Home</Link>
                    <Accordion type="single" className="" collapsible>
                        <AccordionItem value="item-category">
                            <AccordionTrigger>
                                Category
                            </AccordionTrigger>
                            <AccordionContent>
                                <Accordion type="single" className="" collapsible>
                                    {data.map((category) => (
                                        <AccordionItem key={category.id} value={`item-${category.id}`}>
                                            <AccordionTrigger>
                                                <Link onClick={() => setOpen(false)} href={`/product/category/${category.name}`}>
                                                    {category.name}
                                                </Link>
                                            </AccordionTrigger>
                                            {category.children.map((sub) => (
                                                <AccordionContent key={sub.id}>
                                                    <Link onClick={() => setOpen(false)} href={`/product/category/${sub.name}`}>
                                                        {sub.name}
                                                    </Link>
                                                </AccordionContent>
                                            ))}
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Link href="#" className="pb-3" onClick={() => setOpen(false)}>Track Order</Link>
                    <Link href="#" onClick={() => setOpen(false)}>Contact Us</Link>
                </div>
            </SheetContent>
        </Sheet>

    )
}