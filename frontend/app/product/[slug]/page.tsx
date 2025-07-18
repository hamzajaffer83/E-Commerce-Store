'use client'
import { useParams } from 'next/navigation';
import {useEffect, useState} from "react";
import type {Product} from "@/types/data";

export default function SingleProduct(){
    const params = useParams();
    const slug = params?.slug as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        fetch(`/api/products/${slug}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    const product = data.data as Product;
                    setData(product);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch category data:', err);
                setLoading(false);
            });
    }, [slug]);

    console.log(data);

    return(
        <>Product Slug: {slug}</>
    )
}