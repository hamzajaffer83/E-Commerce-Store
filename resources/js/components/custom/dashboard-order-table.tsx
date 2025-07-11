"use client"

import * as React from "react"
import { Link, router } from '@inertiajs/react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"

import { Order } from "@/types/data"

const ORDER_STATUSES: Order["status"][] = ["paid", "pending", "shipped", "cancelled"]

export default function DashboardOrderTable({
    rawData,
    filterData,
    heading,
    caption,
}: {
    rawData: Order[]
    filterData: boolean
    heading: string
    caption: string
}) {
    const [orders, setOrders] = React.useState<Order[]>(rawData)
    const [statusFilter, setStatusFilter] = React.useState<"all" | Order["status"]>("all")

    const handleStatusChange = (id: number, newStatus: Order["status"]) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === id ? { ...order, status: newStatus } : order
            )
        )

        router.put(route("update.order.status", id), {
            status: newStatus,
        })
    }

    const filteredOrders = React.useMemo(() => {
        if (statusFilter === "all") return orders
        return orders.filter((order) => order.status === statusFilter)
    }, [orders, statusFilter])

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{heading}</CardTitle>

                    {filterData && (
                        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="cursor-pointer" >All</SelectItem>
                                {ORDER_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status} className="cursor-pointer">
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableCaption>{caption}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Order ID</TableHead>
                            <TableHead>Phone No</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.map((data) => (
                            <TableRow key={data.id}>
                                <TableCell className="font-medium">
                                    <Link href={route('single.order', data.id)} className="hover:underline" >{data.id}</Link>
                                </TableCell>
                                <TableCell>{data.phone_no}</TableCell>
                                <TableCell>{data.city}</TableCell>
                                <TableCell>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            handleStatusChange(data.id, value as Order["status"])
                                        }
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ORDER_STATUSES.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-right">PKR {data.price}</TableCell>
                            </TableRow>
                        ))}
                        {filteredOrders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No orders found for selected status.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
