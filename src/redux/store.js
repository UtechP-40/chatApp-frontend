import {configureStore} from '@reduxjs/toolkit';
import userAuthReducer from './features/userAuthSlice';
import userThemeReducer from './features/userThemeSlice';
// import chatSlice from './features/userAuthSlice';
import chatSlice from './features/chatSlice';
const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        userTheme: userThemeReducer,
        chat: chatSlice,
    }
});

export default store;