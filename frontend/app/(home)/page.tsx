import { Suspense } from "react";
import HomeProductSectionSkeleton from "@/components/home-product-section-skeleton";
import type { ProductPagination } from "@/types/pagination";
import ProductDisplaySection from "@/components/sections/product-display-section";
import LogoClientInitializer from "../logoInitializer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || "";

async function getProducts() {
  const res = await fetch(`${apiUrl}/api/products/all`, {
    next: { revalidate: 3600 },
    headers: {
      ApiSecretKey: apiSecretKey,
    },
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Home() {
  const response: any = await getProducts();
  const products = response.data as ProductPagination;
  return (
    <div>
      {products ? (
        <Suspense fallback={<HomeProductSectionSkeleton />}>
          <LogoClientInitializer logo="/logo.svg" />
          <ProductDisplaySection products={products} />
          
        </Suspense>
      ) : (
        <div className="w-full flex h-[64vh] items-center justify-center">
          <h1>No Product Found</h1>
        </div>
      )}
    </div>
  );
}
