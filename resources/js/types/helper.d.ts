export type Variant = {
    image: File | null;
    size: string;
    color: string;
    price: string;
    sale_price?: string;
    quantity: number;
    sku?: string;
};
