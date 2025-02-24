import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type LanguageState = {
  language: "en" | "az" | "ru";
};

const initialState: LanguageState = {
  language: "en", // Varsayılan olarak 'en'
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"en" | "az" | "ru">) => {
      state.language = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("language", action.payload);
      }
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const selectLanguage = (state: RootState) => state.language.language;
export default languageSlice.reducer;
