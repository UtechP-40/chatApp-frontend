import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

const initialState = {
  users: [],
  selectedUser: null,
  isUsersLoading: false,
};

// Utility function to include token in headers
const addAuthHeaders = (config = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return config;
};

// Fetch Friends
export const getFriends = createAsyncThunk('chat/getFriends', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/auth/get-friends', addAuthHeaders());
    return response.data.data; // Assuming response contains friends data in 'data'
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch friends');
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch friends');
  }
});

// Remove Friend
export const removeFriend = createAsyncThunk('friend/removeFriend', async (friendId, thunkAPI) => {
  try {
    const response = await axiosInstance.delete(`/auth/remove-friend/${friendId}`, addAuthHeaders()); // Adjust endpoint
    toast.success('Friend removed successfully');
    return friendId; // Return the friendId to remove it from the state
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to remove friend');
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove friend');
  }
});

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
      state.messages = []; // Clear messages when switching users
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFriends.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload; // Save friends data in users
      })
      .addCase(getFriends.rejected, (state) => {
        state.isUsersLoading = false;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        // Remove the friend from the state by filtering out the friendId
        state.users = state.users.filter((friend) => friend._id !== action.payload);
      });
  },
});

export const { setSelectedUser } = friendSlice.actions;

export default friendSlice.reducer;
