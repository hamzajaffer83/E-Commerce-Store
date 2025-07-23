import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import logoReducer from './logoSlice';
import colorReducer from './colorSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        logo: logoReducer,
        color: colorReducer,
    }
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
