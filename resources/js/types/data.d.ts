import { Variant } from "./helper";

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
    type: 'simple' | 'variable';
    cover_image: File | null;
    category_id: number;
    sub_category_id?: number;
    // Variants Type here
}
