import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

const initialState = {
  searchedUsers: [], // Holds the list of users matching the search query
  isLoading: false, // Tracks loading state for the operations
  error: null, // Tracks error messages
};

// Async thunk to fetch users based on a search query
export const fetchSearchedUsers = createAsyncThunk(
  'user/fetchSearchedUsers',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/auth/search-users?name=${searchQuery}`);
      // console.log(response.data)
      return response.data?.data; // Assuming the data is wrapped in a `data` property
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Async thunk to add a friend
export const addFriend = createAsyncThunk(
  'user/addFriend',
  async (friendId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/add-friend', { friendId });
      toast.success('Friend added successfully!');
      return response.data?.data; // Assuming the data is wrapped in a `data` property
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add friend');
      return rejectWithValue(error.response?.data?.message || 'Failed to add friend');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSearchedUsers(state) {
      state.searchedUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Searched Users
      .addCase(fetchSearchedUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchedUsers = action.payload;
      })
      .addCase(fetchSearchedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Friend
      .addCase(addFriend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFriend.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchedUsers } = userSlice.actions;

export default userSlice.reducer;
