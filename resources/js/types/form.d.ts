export interface CategoryForm {
    name: string
}

export interface ProductForm {
    title: string
    cover_image: File | null
    description: string
    category_id: number | null
    sub_category_id: number | null
    type: 'simple' | 'variable'

    // For simple product
    sizes: string[]
    color: string
    price: string
    sale_price: string
    sale_start_at: string
    sale_end_at: string
    quantity: number | null

    // For variable product
    variants: {
        image: File | null;
        size: string;
        color: string;
        price: string;
        sale_price?: string;
        quantity: number;
        sku?: string;
    }[]
}