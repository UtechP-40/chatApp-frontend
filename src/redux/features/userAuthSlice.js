import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { axiosInstance } from './../../lib/axios';
import toast from 'react-hot-toast';


const initialState = {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
};

export const loginUser = createAsyncThunk(
    'userAuth/loginUser',
    async (credentials, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            toast.success(response.data.message);
            console.log(response.data);
            return response.data;
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
            console.log(response.data);
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
            toast.success(response.data.message);
            return response.data;
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
            // await axiosInstance.get('/auth/logout');
            const response = await axiosInstance.get('/auth/check-auth');
            // console.log(response.data);
            return response.data; 
        } catch (error) {
            if (error.response?.data?.message === 'Invalid Access Token') {
                try {
                    const refreshResponse = await axiosInstance.post('/auth/refresh-token');

                    const retryResponse = await axiosInstance.get('/auth/check-auth');
                    return retryResponse.data;
                } catch (refreshError) {
                    return thunkAPI.rejectWithValue(refreshError.response?.data?.message || 'Token refresh failed');
                }
            }

            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Auth check failed');
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

    }
});


export const { logoutUserAction } = userAuthSlice.actions;

export default userAuthSlice.reducer;