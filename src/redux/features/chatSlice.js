import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

const initialState = {
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
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

export const getUsers = createAsyncThunk('chat/getUsers', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/message/users', addAuthHeaders());
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch users');
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const getMessages = createAsyncThunk('chat/getMessages', async (userId, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/message/${userId}`, addAuthHeaders());
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch messages');
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async (formData, thunkAPI) => {
  try {
    const selectedUser = thunkAPI.getState().chat.selectedUser;
    if (!selectedUser) {
      throw new Error('No user selected');
    }

    const response = await axiosInstance.post(
      `/message/send/${selectedUser._id}`,
      formData,
      addAuthHeaders()
    );
    toast.success('Message sent successfully');
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to send message');
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send message');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
      state.messages = []; // Clear messages when switching users
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    subscribeToMessages(state, action) {
      const { socket } = action.payload;
      if (!state.selectedUser || !socket) return;

      socket.on('newMessage', (newMessage) => {
        if (newMessage.senderId === state.selectedUser._id) {
          state.messages.push(newMessage);
        }
      });
    },
    unsubscribeFromMessages(state, action) {
      const { socket } = action.payload;
      if (socket) {
        socket.off('newMessage');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isUsersLoading = false;
      });

    builder
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      });

    builder
      .addCase(sendMessage.pending, (state) => {
        state.isSendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isSendingMessage = false;
      });
  },
});

export const { setSelectedUser, addMessage, subscribeToMessages, unsubscribeFromMessages } =
  chatSlice.actions;

export default chatSlice.reducer;
