'use client';

import { useState, useMemo } from "react";
import { type Product } from "@/types/data";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";

export default function ProductDisplaySection({ products }: { products: Product[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, products]);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center p-2 mb-4 border-b">
                <h1 className="text-3xl font-semibold">Products</h1>
                <Input
                    placeholder="Search Products"
                    className="w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredProducts.map((product: Product) => (
                        <div key={product.id} className="mx-auto">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-sm mt-6">No Products Found</p>
            )}
        </section>
    );
}
