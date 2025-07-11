export type Variant = {
    image: File | null;
    size: string;
    color: string;
    price: string;
    sale_price?: string;
    quantity: number;
    sku?: string;
};

export type ProductVariationImage = {
    id: number;
    product_variation_id: number;
    image_path: string;
    created_at: string;
    updated_at: string;
}