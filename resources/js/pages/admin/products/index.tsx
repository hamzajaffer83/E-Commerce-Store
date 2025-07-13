import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ProductPagination } from '@/types/paginations';
import TableHeader from '@/components/custom/table-header';
import PerPageDropdown from '@/components/custom/per-page-dropdown';
import Pagination from '@/components/custom/pagination';
import DataTable from '@/pages/admin/products/components/data-table';
import ConfirmDialogBox from './components/confirm-dialog-box';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'All Products', href: '/admin/product' }];

export default function ProductIndex({ products, per_page }: { products: ProductPagination; per_page: number }) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const filterProducts = products.data.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { autoClose: 3000 });
        if (flash?.error) toast.error(flash.error, { autoClose: 3000 });
    }, [flash]);

    const confirmDelete = (id: number) => {
        setSelectedProductId(id);
        setShowConfirmModal(true);
    };

    const handleDelete = () => {
        if (!selectedProductId) return;

        setLoading(true);
        router.delete(route('admin.product.destroy', selectedProductId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Product deleted successfully.');
                setShowConfirmModal(false);
            },
            onError: () => toast.error('Failed to delete product.'),
            onFinish: () => {
                setLoading(false);
                setSelectedProductId(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Products" />

            <div className="m-5 rounded-md border p-4 shadow-sm">
                {/* Header with search bar, create btn, dropdown */}
                <TableHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    btnText="Add Product"
                    route={route('admin.product.create')}
                />

                {/* Table */}
                <DataTable filterProducts={filterProducts} handleProductDelete={confirmDelete} />

                {/* Per Page & Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <PerPageDropdown per_page={per_page} route={route('admin.product.index')} />
                    <Pagination pagination={products} />
                </div>
            </div>

            <ConfirmDialogBox
                open={showConfirmModal}
                onOpenChange={setShowConfirmModal}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                loading={loading}
            />
        </AppLayout>
    );
}
