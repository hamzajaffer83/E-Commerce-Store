import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ProductPagination } from '@/types/paginations';
import TableHeader from '@/components/custom/table-header';
import PerPageDropdown from '@/components/custom/per-page-dropdown';
import Pagination from '@/components/custom/pagination';
import Table from '@/pages/admin/category/components/table';
import DataTable from '@/pages/admin/products/components/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'All Products', href: '/admin/product' }];

export default function ProductIndex({ products, per_page}: { products: ProductPagination; per_page: number }) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [displayType, setDisplayType] = useState<'Table' | 'Card'>('Table');
    const [searchTerm, setSearchTerm] = useState('');

    const filterProducts = products.data.filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { autoClose: 3000 });
        if (flash?.error) toast.error(flash.error, { autoClose: 3000 });
    }, [flash]);

    const handleProductDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        router.delete(route('admin.product.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Product deleted successfully.'),
            onError: () => toast.error('Failed to delete product.'),
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Products" />
            <div className="m-5 rounded-md border p-4 shadow-sm">
                {/* Header with search bar, create btn, dropdown */}
                <div className="flex gap-2">
                    <TableHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} btnText="Add Product" route={route('admin.category.create')} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Display Type: {displayType}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => {
                                    setDisplayType('Table');
                                }}
                            >
                                Table
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setDisplayType('Card');
                                }}
                            >
                                Card
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table */}
                <DataTable filterProducts={filterProducts} handleProductDelete={handleProductDelete} />

                {/* Per Page & Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    {/* Per Page Dropdown */}
                    <PerPageDropdown per_page={per_page} route={route('admin.product.index')} />

                    {/* Pagination */}
                    <Pagination pagination={products} />
                </div>
            </div>
        </AppLayout>
    );
}
