export interface CartItem {
    id: number | null;
    cart_id: number | null;
    product_variation_id: number;
    quantity: number;
    product_variation?: any;
}

export interface CartState {
    session_id: string | null;
    user_id: number | null;
    cartItem: CartItem[];
    lastAddedItem?: {
        product_variation_id: number;
        quantity: number;
    };
}

export interface Cart {
    session_id: string | null;
    user_id: number | null;
    cartItem: CartItem[];
    created_at: string;
    updated_at: string;
}