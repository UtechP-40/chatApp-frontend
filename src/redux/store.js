import {configureStore} from '@reduxjs/toolkit';
import userAuthReducer from './features/userAuthSlice';
import userThemeReducer from './features/userThemeSlice';

const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        userTheme: userThemeReducer,
    }
});

export default store;