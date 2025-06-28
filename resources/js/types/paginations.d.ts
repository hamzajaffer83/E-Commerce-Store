import { Category } from "@/types/data";

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface CategoryPagination {
    current_page: number;
    data: Category[];
    first_page_url: string;
    from: number | null;
    links: PaginationLink[];
    last_page: number;
    last_page_url: string;
    next_page_url?: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}