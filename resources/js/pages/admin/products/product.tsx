import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Product } from '@/types/data';
import { ProductVariationImage } from '@/types/helper';
import { Head } from "@inertiajs/react";

type ProductProp = {
    id: number;
    product_id: number;
    sizes: [];
    color: string;
    price: string;
    sale_price: null | string
    sale_start_at: null | string;
    sale_end_at: null | string;
    quantity: number;
    sku: null | string;
    created_at: string;
    updated_at: string;
    product: Product;
    images: ProductVariationImage;
};

export default function SingleProduct({ variant }: { variant: ProductProp }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Order Product',
            href: `/product/${variant.id}`,
        },
    ];
    console.log(variant);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Single Product" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                Single Product
            </div>

        </AppLayout>
    );
}