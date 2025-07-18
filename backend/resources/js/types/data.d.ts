import { ProductVariationImage, Variant } from "./helper";

export interface Category {
    id: number,
    name: string,
    parent_id: number | null,
}

export type VariableProductData = {
    variants: Variant[];
    sale_start_at: string;
    sale_end_at: string;
    price: string;
    sale_price: string;
};

export type Product = {
    id: number;
    title: string;
    description: string;
    slug: string;
    type: 'simple' | 'variable';
    cover_image: File | null;
    category_id: number;
    sub_category_id?: number;
    variations: Variant[];
    sale_start_at?: string;
    sale_end_at?: string;
    price: string;
    sale_price?: string;
    created_at: string;
    updated_at: string;
}

export type OrderItems = {
    id: number;
    order_id: number;
    product_variation_id: number;
    quantity: number;
    product: Product;
    product_variation : VariableProductData;
    product_variation_image? : ProductVariationImage ; 
    created_at: string;
    updated_at: string;
}

export type Order = {
    id: number;
    user_id: number;
    price: string;
    status: 'paid' | 'pending' | 'cancelled' | 'shipped';
    phone_no: string;
    address: string;
    city: string;
    created_at: string;
    updated_at: string;
}