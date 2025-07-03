import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'All Products', href: '/admin/product' }];

export default function ProductIndex() {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { autoClose: 3000 });
        if (flash?.error) toast.error(flash.error, { autoClose: 3000 });
    }, [flash]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Products" />
            <Button>
                <Link href={route('admin.product.create')}>Create Product</Link>
            </Button>
        </AppLayout>
    );
}
