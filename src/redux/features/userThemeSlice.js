import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: localStorage.getItem("theme") || 'coffee',
};

const userThemeSlice = createSlice({
    name: 'userTheme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload);
        },
    },
});

export const { setTheme } = userThemeSlice.actions;

export default userThemeSlice.reducer;