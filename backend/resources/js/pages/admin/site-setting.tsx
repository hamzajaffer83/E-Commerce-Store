import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Site Setting',
        href: '/admin/web-site/setting',
    },
];

export default function SiteSetting() {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { autoClose: 3000 });
        if (flash?.error) toast.error(flash.error, { autoClose: 3000 });
    }, [flash]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site Setting" />
            
        </AppLayout>
    );
}
