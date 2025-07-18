import { type Variation, type SocialLink, type ProductImage } from "./helper";

export type Product = {
    id: number;
    title: string;
    description: string;
    cover_image: string;
    slug: string;
    type: 'simple' | 'variable';
    category_id: number;
    sub_category_id: number;
    variations: Variation[];
    social_links: SocialLink[];
    images: ProductImage[];
    created_at: string;
    updated_at: string;
}

export type SubCategory = {
    id: number;
    name: string;
    parent_id: number;
    created_at: string;
    updated_at: string;
}

export type Category = {
    id: number;
    name: string;
    children: SubCategory[];
    created_at: string;
    updated_at: string;
}