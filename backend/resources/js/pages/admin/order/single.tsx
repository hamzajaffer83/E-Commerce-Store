import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Order, OrderItems } from '@/types/data';
import { Head, Link } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { convertUtcToLocal, truncateWords } from '@/lib/utils';

export default function allOrders({ order, order_items, user }: { order: Order; order_items: OrderItems[]; user: User }) {

    console.log(order_items);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'All Orders',
            href: `/admin/single-order/${order.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Single Order" />
            <div className="mx-auto">
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto w-3xl mt-5 border rounded-xl p-4">
                    <div className="flex justify-between items-center">
                        <div className="border rounded-md p-2">
                            <h1>{user.name}</h1>
                            <p>{user.email}</p>
                        </div>
                        <div className="">Order #{order.id}</div>
                    </div>

                    <p> <b>Order Details</b> ({order_items.length})</p>
                    <div className="">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Product Image</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order_items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.product.type === 'simple' ?
                                                <img src={`/storage/${item.product.cover_image}`} /> :
                                                <img src={`/storage/${item.product_variation_image?.image_path}`} />
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Link href={route('single.product',  item.product_variation_id )} className='hover:underline'>{truncateWords(item.product.title, 4)}</Link>
                                        </TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-between">
                        <div className="">
                            <div className="flex gap-2">
                                <b>Address:</b>
                                <p>{order.address}</p>
                            </div>
                            <div className="flex gap-2">
                                <b>city:</b>
                                <p>{order.city}</p>
                            </div>
                            <div className="flex gap-2">
                                <b>Phone No:</b>
                                <p>{order.phone_no}</p>
                            </div>
                            <div className="flex gap-2">
                                <b>Create at:</b>
                                <p>{convertUtcToLocal(order.created_at)}</p>
                            </div>
                        </div>
                        <div className='border flex gap-2 h-fit p-3'>
                            <p>Total:</p>
                            <p>{order.price}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}