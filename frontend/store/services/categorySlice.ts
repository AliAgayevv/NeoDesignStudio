import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type categoryState = {
  category: "all" | "interior" | "exterior" | "business";
};
const initialState: categoryState = {
  category: "all",
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (
      state,
      action: PayloadAction<"all" | "interior" | "exterior" | "business">,
    ) => {
      state.category = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("category", action.payload);
      }
    },
  },
});

export const { setCategory } = categorySlice.actions;
export const selectCategory = (state: RootState) => state.category.category;
export default categorySlice.reducer;
