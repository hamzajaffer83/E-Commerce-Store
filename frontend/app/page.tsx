
import { Suspense } from 'react';
import HomeProductSection from "@/components/sections/home-product-section";
import HomeProductSectionSkeleton from '@/components/home-product-section-skeleton';

export default function Home() {
  return (
    <div>
        <Suspense fallback={<HomeProductSectionSkeleton />}>
            <HomeProductSection />
        </Suspense>
    </div>
  );
}
