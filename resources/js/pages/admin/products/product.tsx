import AppLayout from '@/layouts/app-layout';
import { convertUtcToLocalDate } from '@/lib/utils';
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
    sale_price: string
    sale_start_at: string;
    sale_end_at: string;
    quantity: number;
    sku: null | string;
    created_at: string;
    updated_at: string;
    product: Product;
    images?: ProductVariationImage;
};

export default function SingleProduct({ variant }: { variant: ProductProp }) {
    console.log(variant);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Single Variant Product',
            href: `/product/variant/${variant.id}`,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Single Product" />
            <div className="p-4 mx-auto border mt-3 rounded-lg">
                    <div className='py-2 border-b'><b>Slug:</b> {variant.product.slug}</div>
                    <div className="h-full lg:flex">
                        <div className="lg:w-1/2">
                            {variant.product.type === 'simple' ?
                                <img src={`/storage/${variant.product.cover_image}`} alt={variant.product.title} className='w-full h-auto' />
                                :
                                <img src={`/storage/${variant.images?.image_path}`} alt={variant.product.title} className='w-full h-auto' />
                            }
                        </div>
                        <div className="p-3">
                            <h1 className='text-2xl font-semibold sm:text-4xl'>{variant.product.title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: variant.product.description }} />
                            <div className="">
                                <div className="flex gap-2 mt-2">
                                    <div className='px-4 py-1 rounded-full border'><b>Price:</b> {variant.price}</div>
                                    <div className='px-4 py-1 rounded-full border'><b>Size:</b> {variant.sizes}</div>
                                    <div className='px-4 py-1 rounded-full border'><b>Type:</b> {variant.product.type}</div>
                                </div>
                            </div>
                            {variant.sale_price && (
                                <div className="sm:flex gap-2 mt-2 py-2">
                                    <div className='px-4 py-1 rounded-full border'><b>Sale Price:</b> {variant.sale_price}</div>
                                    <div className='px-4 py-1 rounded-full border'><b>Start At:</b> {convertUtcToLocalDate(variant.sale_start_at)}</div>
                                    <div className='px-4 py-1 rounded-full border'><b>End At:</b> {convertUtcToLocalDate(variant.sale_end_at)}</div>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
        </AppLayout>
    );
}