import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from './../../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development"
    ? "http://localhost:80"
    : import.meta.env.VITE_BASE_URL;

const initialState = {
    authUser: null,
    isSigningUp: false,
    isUpdatingProfile: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null
};

const saveTokensToLocalStorage = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

const clearTokensFromLocalStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

export const loginUser = createAsyncThunk(
    'userAuth/loginUser',
    async (credentials, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            const { accessToken, refreshToken, user } = response.data.data;
            saveTokensToLocalStorage(accessToken, refreshToken);
            toast.success(response.data.message);
            return user;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'userAuth/logoutUser',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/logout');
            clearTokensFromLocalStorage();
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

export const signupUser = createAsyncThunk(
    'userAuth/signupUser',
    async (userDetails, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/signup', userDetails);
            const { accessToken, refreshToken, user } = response.data.data;
            saveTokensToLocalStorage(accessToken, refreshToken);
            toast.success(response.data.message);
            return user;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Signup failed');
        }
    }
);

export const checkAuth = createAsyncThunk(
    'userAuth/checkAuth',
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
                return thunkAPI.rejectWithValue(refreshError.response?.data?.message || 'Token refresh failed');
            }
        }
    }
);

export const updateProfile = createAsyncThunk(
    'userAuth/updateProfile',
    async (profilePic, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/update-profile', profilePic);
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Profile update failed');
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Profile update failed');
        }
    }
);

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        logoutUserAction(state) {
            state.authUser = null;
            state.isCheckingAuth = false;
            clearTokensFromLocalStorage();
        },
        connectSocket(state) {
            if (!state.authUser || state.socket?.connected) return;
            const socket = io(BASE_URL, {
                query: {
                    authUser: state.authUser._id
                }
            });
            socket.connect();
            socket.on("getOnlineUsers", (userIds) => {
                state.onlineUsers = userIds;
            });
            state.socket = socket;
        },
        disconnectSocket(state) {
            if (state.socket?.connected) {
                state.socket.disconnect();
            }
        }
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
    }
});

export const { logoutUserAction, connectSocket, disconnectSocket } = userAuthSlice.actions;

export default userAuthSlice.reducer;
