import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Language = "en" | "es"

interface UIState {
  language: Language
  theme: "light" | "dark" // mirror DOM class; not strictly needed for logic
}

const initialState: UIState = {
  language: "en",
  theme: "light",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLanguage: (s, a: PayloadAction<Language>) => void (s.language = a.payload),
    setTheme: (s, a: PayloadAction<"light" | "dark">) => void (s.theme = a.payload),
  },
})

export const { setLanguage, setTheme } = uiSlice.actions
export default uiSlice.reducer
