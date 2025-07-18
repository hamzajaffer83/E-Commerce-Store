export type VariableProductErrors = {
    variants?: {
        price?: string;
        image?: string;
        sale_price?: string;
        size?: string;
        color?: string;
        quantity?: string;
        sku?: string;
    }[];
    sale_start_at?: string;
    sale_end_at?: string;
    price?: string;
    sale_price?: string;
};
