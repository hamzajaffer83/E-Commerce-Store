'use client'

import { useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { type Product } from '@/types/data';
import HomeProductSectionSkeleton from "@/components/home-product-section-skeleton";
import ProdductDisplaySection from "@/components/sections/product-display-section";
import ProductCard from "@/components/product-card";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';

export default function CategoryProduct() {
    const params = useParams();
    const name = params?.name as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!name) return;

        fetch(`${apiUrl}/api/product/category/${name}`, {
            next: { revalidate: 3600 },
            headers: {
                'ApiSecretKey': apiSecretKey,
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    const product = data.data as Product[];
                    setData(product);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch category data:', err);
                setLoading(false);
            });
    }, [name]);


    return (
        <Suspense fallback={<HomeProductSectionSkeleton/>}>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {loading ? (
                    <HomeProductSectionSkeleton />
                ) : data && data.length > 0 ? (
                    <ProdductDisplaySection products={data} />
                ) : (
                    <p className="text-center text-gray-500 text-sm mt-6">No Products Found</p>
                )}
            </section>
        </Suspense>
    );
}
