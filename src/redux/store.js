import {configureStore} from '@reduxjs/toolkit';
import userAuthReducer from './features/userAuthSlice';
import otherSlice from './features/otherSlice'
import userThemeReducer from './features/userThemeSlice';
// import chatSlice from './features/userAuthSlice';
import chatSlice from './features/chatSlice';
// import friendSlice from "./features/friendsSlice"
import friendSlice from './features/friendsSlice';
import groupSlice from "./features/groupSlice"
const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        userTheme: userThemeReducer,
        chat: chatSlice,
        other:otherSlice,
        friends:friendSlice,
        groups:groupSlice
    }
});

export default store;