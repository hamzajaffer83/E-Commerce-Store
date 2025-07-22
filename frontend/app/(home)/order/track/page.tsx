"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PackageCheck, Clock, Truck } from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';

export default function OrderTrackingPage() {
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const [error, setError] = useState("");

    const fetchOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setOrderData(null);
        setError("");

        try {
            const res = await fetch(`${apiUrl}/api/track-order/${orderId}`, {
                headers: {
                    'ApiSecretKey': apiSecretKey,
                }
            });
            if (!res.ok) throw new Error("Order not found");

            const data = await res.json();
            setOrderData(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const renderStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="text-yellow-500" />;
            case "confirmed":
                return <PackageCheck className="text-blue-500" />;
            case "shipped":
                return <Truck className="text-orange-500" />;
            case "delivered":
                return <PackageCheck className="text-green-600" />;
            default:
                return <Clock />;
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Track Your Order</h1>
            <form onSubmit={fetchOrder} className="flex flex-col gap-4">
                <Input
                    type="text"
                    placeholder="Enter your Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="text-lg"
                />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <Loader2 className="animate-spin" /> : "Track Order"}
                </Button>
            </form>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {orderData && (
                <Card className="mt-6">
                    <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {renderStatusIcon(orderData.status)}
                            <div>
                                <p className="font-semibold">Status: <span className="capitalize">{orderData.status}</span></p>
                                <p className="text-sm text-gray-600">Last updated: {orderData.last_updated}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Order ID: #{orderData.order_id}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
