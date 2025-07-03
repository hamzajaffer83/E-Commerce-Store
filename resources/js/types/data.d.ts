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