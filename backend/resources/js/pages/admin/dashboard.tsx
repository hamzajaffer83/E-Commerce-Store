import DashboardCard from '@/components/custom/dashboard-cards';
import DashboardChart from '@/components/custom/dashboard-chart';
import DashboardOrderTable from '@/components/custom/dashboard-order-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Order } from '@/types/data';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

type Props = {
    totalProducts: number;
    totalOrders: [];
    pendingOrders: Order[];
    totalRevenue: number;
};

export default function Dashboard({ totalProducts, totalOrders, totalRevenue, pendingOrders }: Props) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { autoClose: 3000 });
        if (flash?.error) toast.error(flash.error, { autoClose: 3000 });
    }, [flash]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <DashboardCard heading='Total Products' number={totalProducts} desc1='Total Number Of Products' desc2='Total Number of Active Products' />
                    <DashboardCard heading='Total Orders' number={totalOrders.length} desc1='Total Number Of Orders' desc2='Total Number of Pending, Paid, Shipped Orders' />
                    <DashboardCard heading='Total Revenue' badge='Paid OR Shipped' number={`PKR ${totalRevenue}`} desc1='Total Revenue' desc2='Total Revenue of this month' />
                </div>
                <DashboardChart rawData={totalOrders} />
                <DashboardOrderTable filterData={false} heading="New Orders" caption="A List of All Pending Orders" rawData={pendingOrders} />
            </div>
        </AppLayout>
    );
}
