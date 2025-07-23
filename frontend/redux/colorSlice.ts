// redux/colorSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ColorState {
  value: string;
}

const initialState: ColorState = {
  value: "#ffffff", // default
};

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColor: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setColor } = colorSlice.actions;
export default colorSlice.reducer;
