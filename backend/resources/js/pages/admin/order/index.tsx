import DashboardOrderTable from "@/components/custom/dashboard-order-table";
import Pagination from "@/components/custom/pagination";
import PerPageDropdown from "@/components/custom/per-page-dropdown";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { OrderPagination } from "@/types/paginations";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Orders',
        href: '/admin/all-orders',
    },
];

export default function allOrders({ allOrders, per_page }: { allOrders: OrderPagination, per_page: number }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DashboardOrderTable filterData={true} heading="All Orders" caption="A List of All Orders" rawData={allOrders.data} />
                <div className="mt-4 flex items-center justify-between">
                    {/* Per Page Dropdown */}
                    <PerPageDropdown per_page={per_page} route={route('all.orders')} />

                    {/* Pagination */}
                    <Pagination pagination={allOrders} />
                </div>
            </div>

        </AppLayout>
    );
}