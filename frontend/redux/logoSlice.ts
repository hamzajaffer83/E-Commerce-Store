import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LogoState = {
    logo: string;
};

const initialState: LogoState = {
    logo: '/logo.svg',
};

const logoSlice = createSlice({
    name: 'logo',
    initialState,
    reducers: {
        updateLogo(state, action: PayloadAction<string>) {
            state.logo = action.payload;
        },
    },
});

export const { updateLogo } = logoSlice.actions;
export default logoSlice.reducer;
