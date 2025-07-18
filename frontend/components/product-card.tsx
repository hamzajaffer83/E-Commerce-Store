'use client'

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { type Product } from "@/types/data"
import Image from "next/image"
import  { useRouter } from "next/navigation"

export default function ProductCard({ product }: { product: Product}){
    const router = useRouter()
    const appUrl = process.env.NEXT_PUBLIC_API_URL;
    return (
        <Card
            className="max-w-xs cursor-pointer"
            onClick={() => router.push(`/product/${product.slug}`)}
        >
            <CardHeader className="h-[250px] overflow-hidden">
                <Image
                    src={`${appUrl}/storage/${product.cover_image}`}
                    width={250}
                    height={250}
                    alt="Product Cover"
                    className="object-cover w-full h-full"
                />
            </CardHeader>

            <CardContent>
                {/* Product Title */}
                <p className="text-sm hover:underline line-clamp-2" title={product.title}>
                    {product.title}
                </p>

                {/* Price or Price Range */}
                <p className="font-semibold mt-1 text-gray-700">
                    {product.type === "simple" ? (
                        product.variations[0].sale_price ? (
                            <>
                                <span className="text-red-500 mr-2">${parseFloat(product.variations[0].sale_price).toFixed(2)}</span>
                                <span className="line-through text-sm text-gray-500">${parseFloat(product.variations[0].price).toFixed(2)}</span>
                            </>
                        ) : (
                            product.variations[0].price ? (
                                <>${parseFloat(product.variations[0].price).toFixed(2)}</>
                            ) : (
                                <>No price available</>
                            )
                        )
                    ) : product.variations?.length > 0 ? (
                        (() => {
                            const prices = product.variations.map(v => parseFloat(v.price));
                            const minPrice = Math.min(...prices);
                            const maxPrice = Math.max(...prices);
                            return minPrice === maxPrice
                                ? `$${minPrice.toFixed(2)}`
                                : `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`;
                        })()
                    ) : (
                        <>No price available</>
                    )}
                </p>

                {/* Optional: Color Swatches if variation has color attribute */}
                {/* You can expand this block based on how you store variation attributes */}
                {/* Example: product.variations[0]?.attributes?.color */}
            </CardContent>
        </Card>

    )
}