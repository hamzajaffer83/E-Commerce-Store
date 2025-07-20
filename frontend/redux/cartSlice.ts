import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CartItem, CartState} from '@/types/cart';
import {getSessionOrUserId} from "@/lib/service";

const initialState: CartState = {
    session_id: null,
    user_id: null,
    cartItem: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Set User_id or Session_id base on auth status
        setUserSession(state) {
            const {user_id, session_id} = getSessionOrUserId();

            // Ensure mutual exclusivity
            state.user_id = user_id;
            state.session_id = session_id;
        },
        // Add To Cart Function

        addToCart(state, action: PayloadAction<CartItem>) {
            const {product_variation_id, quantity} = action.payload;
            const existingItem = state.cartItem.find(
                item => item.product_variation_id === product_variation_id
            );
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                // @ts-ignore
                state.cartItem.push({product_variation_id, quantity});
            }
            state.lastAddedItem = action.payload;
        },
        // Remove Specific Item From Cart
        removeCartItem(state, action: PayloadAction<number>) {
            state.cartItem = state.cartItem.filter(
                item => item.id !== action.payload
            );
        },
        // Update Specific Item From Cart
        updateCartItem(state, action: PayloadAction<CartItem>) {
            const {id, quantity} = action.payload;
            const existingItem = state.cartItem.find(
                item => item.id === id
            );
            if (existingItem) {
                existingItem.quantity = quantity;
            }
        },
        // Clear Entire Cart
        clearCart(state) {
            state.cartItem = [];
        },
        // Add CartItems that came from Server
        setCartFromServer(state, action: PayloadAction<CartItem[]>) {
            state.cartItem = action.payload;
        }
    }
});

export const {
    setUserSession,
    addToCart,
    removeCartItem,
    updateCartItem,
    clearCart,
    setCartFromServer
} = cartSlice.actions;

export default cartSlice.reducer;
