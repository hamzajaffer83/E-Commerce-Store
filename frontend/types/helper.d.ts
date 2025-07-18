export type VariationImage = {
    id: number;
    product_variation_id: number;
    image_path: string;
    created_at: string;
    updated_at: string;
}

export type Variation = {
    id: number;
    product_id: number;
    color: string;
    sizes: string[];
    quantity: number;
    price: string;
    sale_price: string;
    sale_start_at: string;
    sale_end_at: string;
    sku: string;
    images: VariationImage[];
    created_at: string;
    updated_at: string;
}

export type SocialLink = {
    id: number;
    product_id: number;
    platform: string;
    url: string;
    created_at: string;
    updated_at: string;
}

export type ProductImage = {
    id: number;
    product_id: number;
    path: string;
    created_at: string;
    updated_at: string;
}