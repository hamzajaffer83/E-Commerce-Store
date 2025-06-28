import Pagination from '@/components/custom/pagination';
import PerPageDropdown from '@/components/custom/per-page-dropdown';
import TableHeader from '@/components/custom/table-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Category } from '@/types/data';
import { CategoryPagination } from '@/types/paginations';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SubTable from '../components/sub-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'All Sub Category', href: '/admin/category/sub' }];

interface Props {
    categories: CategoryPagination;
    per_page: number;
    parent_category: Category;
}

export default function CategoryIndex({ categories, per_page, parent_category }: Props) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { autoClose: 3000 });
        if (flash?.error) toast.error(flash.error, { autoClose: 3000 });
    }, [flash]);

    const filteredCategories = categories.data.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCategoryDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this sub category?')) return;

        router.delete(route('admin.category.sub.destroy', { parent_id: parent_category.id, subCategoryId: id }), {
            preserveScroll: true,
            onSuccess: () => toast.success('Sub category deleted successfully.'),
            onError: () => toast.error('Failed to delete sub category.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`All Sub Category of ${parent_category.name}`} />

            <div className="m-5 rounded-md border p-4 shadow-sm">
                {/* Search and Add Button */}
                <TableHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    route={route('admin.category.sub.create', { parent_id: parent_category.id })}
                />

                {/* Table */}
                <SubTable filteredCategories={filteredCategories} handleCategoryDelete={handleCategoryDelete} parent_id={parent_category.id} />

                {/* Per Page & Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    {/* Per Page Dropdown */}
                    <PerPageDropdown per_page={per_page} route={route('admin.category.sub.index', { parent_id: parent_category.id })} />

                    {/* Pagination */}
                    <Pagination pagination={categories} />
                </div>
            </div>
        </AppLayout>
    );
}
