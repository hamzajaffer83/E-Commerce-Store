'use client'

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { type Product } from "@/types/data"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProductCard({ product }: { product: Product }) {
    const router = useRouter()
    const appUrl = process.env.NEXT_PUBLIC_API_URL

    const handleClick = () => {
        router.push(`/product/${product.slug}`)
    }

    return (
        <Card
            className="group w-full max-w-xs transition hover:shadow-xl p-0 border hover:border-gray-300 cursor-pointer"
            onClick={handleClick}
        >
            <CardHeader className="relative h-[220px] overflow-hidden rounded-t-lg">
                <Image
                    src={`${appUrl}/storage/${product.cover_image}`}
                    alt={product.title}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
            </CardHeader>

            <CardContent className="p-4 space-y-2">
                <h2 className="text-sm font-medium text-gray-900 line-clamp-2" title={product.title}>
                    {product.title}
                </h2>

                <div className="text-sm font-semibold text-gray-800">
                    {product.type === "simple" ? (
                        product.variations[0].sale_price ? (
                            <>
                                <span className="text-red-500 mr-2">
                                    ${parseFloat(product.variations[0].sale_price).toFixed(2)}
                                </span>
                                <span className="line-through text-gray-400 text-xs">
                                    ${parseFloat(product.variations[0].price).toFixed(2)}
                                </span>
                            </>
                        ) : product.variations[0].price ? (
                            <>${parseFloat(product.variations[0].price).toFixed(2)}</>
                        ) : (
                            <>No price available</>
                        )
                    ) : product.variations?.length > 0 ? (
                        (() => {
                            const prices = product.variations.map(v => parseFloat(v.price))
                            const min = Math.min(...prices)
                            const max = Math.max(...prices)
                            return min === max
                                ? `$${min.toFixed(2)}`
                                : `$${min.toFixed(2)} – $${max.toFixed(2)}`
                        })()
                    ) : (
                        <>No price available</>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
