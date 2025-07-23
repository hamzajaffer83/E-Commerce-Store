import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import logoReducer from './logoSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        logo: logoReducer
    }
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
