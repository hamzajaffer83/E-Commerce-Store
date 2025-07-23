import { Category, type Product } from "./data";

export type ProductPagination = {
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
    path: string;
    data: Product[];
    links: [];
    first_page_url: string;
    last_page_url: string;
    next_page_url?: string;
    prev_page_url?: string;
}