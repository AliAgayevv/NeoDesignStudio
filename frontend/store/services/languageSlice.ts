import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type LanguageState = {
  language: "en" | "az" | "ru";
};

const initialState: LanguageState = {
  language: "az",
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"en" | "az" | "ru">) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload); // Kullanıcı dilini kaydet
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const selectLanguage = (state: RootState) => state.language.language;
export default languageSlice.reducer;
