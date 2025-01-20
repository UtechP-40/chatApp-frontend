import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from './../../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

// Constants
const BASE_URL = import.meta.env.MODE === "development"
    ? "http://localhost:80"
    : import.meta.env.VITE_BASE_URL;

const SLICE_NAME = 'userAuth';

// Utility Functions
const getInitialLanguage = () => localStorage.getItem('i18nextLng') || 'en';

const saveTokensToLocalStorage = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

const clearTokensFromLocalStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

const saveLanguageToLocalStorage = (language) => {
    localStorage.setItem('i18nextLng', language);
};

const handleApiError = (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    return message;
};

// Initial State
const initialState = {
    authUser: null,
    isSigningUp: false,
    isUpdatingProfile: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    selectedLanguage: getInitialLanguage(),
};

// Async Thunks
export const loginUser = createAsyncThunk(
    `${SLICE_NAME}/loginUser`,
    async (credentials, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            const { accessToken, refreshToken, user } = response.data.data;
            saveTokensToLocalStorage(accessToken, refreshToken);
            toast.success(response.data.message);
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

export const signupUser = createAsyncThunk(
    `${SLICE_NAME}/signupUser`,
    async (userDetails, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/signup', userDetails);
            const { accessToken, refreshToken, user } = response.data.data;
            saveTokensToLocalStorage(accessToken, refreshToken);
            toast.success(response.data.message);
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

export const updateProfile = createAsyncThunk(
    `${SLICE_NAME}/updateProfile`,
    async (profilePic, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/update-profile', profilePic);
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

export const checkAuth = createAsyncThunk(
    `${SLICE_NAME}/checkAuth`,
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get('/auth/check-auth');
            return response.data.data;
        } catch (error) {
            try {
                const refreshResponse = await axiosInstance.post('/auth/refresh-token');
                const { accessToken, refreshToken } = refreshResponse.data.data;
                saveTokensToLocalStorage(accessToken, refreshToken);
                const retryResponse = await axiosInstance.get('/auth/check-auth');
                return retryResponse.data.data;
            } catch (refreshError) {
                clearTokensFromLocalStorage();
                return thunkAPI.rejectWithValue(
                    refreshError.response?.data?.message || 'Token refresh failed'
                );
            }
        }
    }
);

export const logoutUser = createAsyncThunk(
    `${SLICE_NAME}/logoutUser`,
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/logout');
            clearTokensFromLocalStorage();
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Slice
const userAuthSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        logoutUserAction(state) {
            state.authUser = null;
            state.isCheckingAuth = false;
            clearTokensFromLocalStorage();
        },
        updateOnlineFriends(state, action) {
            state.onlineUsers = action.payload;
        },
        connectSocket(state,action) {
            if (!state.authUser || state.socket?.connected) return;
            const socket = io(BASE_URL, {
                query: {
                    authUser: state.authUser._id
                }
            });
            socket.connect();
            state.socket = socket;
            // let x
            // socket.on("getOnlineUsers", (onlineUserIds) => {
            //     console.log("Online Friends:", onlineUserIds);
            //     // action.asyncDispatch(updateOnlineFriends(onlineUserIds)); // Ensure this action is working
            //     // const onlineUserSet = new Set(onlineUserIds);
            //     // state.onlineUsers = onlineUserIds//
            //     // x = onlineUserIds
            //     action.dispatch(updateOnlineFriends(onlineUserIds))
            // });
            
            // return {socket}
        },
        disconnectSocket(state) {
            if (state.socket?.connected) {
                state.socket.disconnect();
                state.socket = null; // Reset socket state
            }
        },
        setSelectedLanguage(state, action) {
            state.selectedLanguage = action.payload;
            saveLanguageToLocalStorage(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoggingIn = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoggingIn = false;
                state.authUser = action.payload;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoggingIn = false;
            });

        builder
            .addCase(signupUser.pending, (state) => {
                state.isSigningUp = true;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.isSigningUp = false;
                state.authUser = action.payload;
            })
            .addCase(signupUser.rejected, (state) => {
                state.isSigningUp = false;
            });

        builder
            .addCase(checkAuth.pending, (state) => {
                state.isCheckingAuth = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isCheckingAuth = false;
                state.authUser = action.payload;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isCheckingAuth = false;
            });

        builder
            .addCase(logoutUser.pending, (state) => {
                state.isCheckingAuth = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isCheckingAuth = false;
                state.authUser = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isCheckingAuth = false;
            });

        builder
            .addCase(updateProfile.pending, (state) => {
                state.isUpdatingProfile = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isUpdatingProfile = false;
                state.authUser = action.payload;
            })
            .addCase(updateProfile.rejected, (state) => {
                state.isUpdatingProfile = false;
            });
    },
});

// Export Actions and Reducer
export const {
    logoutUserAction,
    connectSocket,
    disconnectSocket,
    setSelectedLanguage,
    updateOnlineFriends,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
