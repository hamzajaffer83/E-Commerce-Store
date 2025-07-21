import { type ProductPagination } from "@/types/pagination";
import { type Product } from "@/types/data"
import ProductCard from '@/components/product-card'

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

export default async function HomeProductSection() {
    const response : any  = await getProducts();
    const products = response.data as ProductPagination;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {products && products.data.length > 0 ? (
                <div className="grid gap-6 grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {products.data.map((product: Product) => (
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
