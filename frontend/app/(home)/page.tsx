import { Suspense } from 'react';
import HomeProductSection from "@/components/sections/home-product-section";
import HomeProductSectionSkeleton from '@/components/home-product-section-skeleton';
import type {ProductPagination} from "@/types/pagination";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';

async function getProducts() {
    const res = await fetch(`${apiUrl}/api/products/all`, {
        next: { revalidate: 3600 },
        headers: {
            'ApiSecretKey': apiSecretKey,
        }
    });

    if (!res.ok) {
        return [];
    }

    return res.json();
}

export default async function Home() {
    const response : any  = await getProducts();
    const products = response.data as ProductPagination;
  return (
    <div>
        <Suspense fallback={<HomeProductSectionSkeleton />}>
            <HomeProductSection products={products} />
        </Suspense>
    </div>
  );
}
