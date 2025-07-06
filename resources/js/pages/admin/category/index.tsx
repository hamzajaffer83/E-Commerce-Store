import Pagination from '@/components/custom/pagination';
import PerPageDropdown from '@/components/custom/per-page-dropdown';
import TableHeader from '@/components/custom/table-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CategoryPagination } from '@/types/paginations';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from './components/table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'All Category', href: '/admin/category' }];

export default function CategoryIndex({ categories, per_page }: { categories: CategoryPagination; per_page: number }) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { autoClose: 3000 });
        if (flash?.error) toast.error(flash.error, { autoClose: 3000 });
    }, [flash]);

    const filteredCategories = categories.data.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCategoryDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        router.delete(route('admin.category.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Category deleted successfully.'),
            onError: () => toast.error('Failed to delete category.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Category" />

            <div className="m-5 rounded-md border p-4 shadow-sm">
                {/* Search and Add Button */}
                <TableHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} btnText="Add Category" route={route('admin.category.create')} />

                {/* Table */}
                <Table filteredCategories={filteredCategories} handleCategoryDelete={handleCategoryDelete} />

                {/* Per Page & Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    {/* Per Page Dropdown */}
                    <PerPageDropdown per_page={per_page} route={route('admin.category.index')} />

                    {/* Pagination */}
                    <Pagination pagination={categories} />
                </div>
            </div>
        </AppLayout>
    );
}
