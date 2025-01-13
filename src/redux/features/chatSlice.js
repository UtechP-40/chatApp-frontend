import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
// import 
const initialState = {
    messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
};

export const getUsers = createAsyncThunk('chat/getUsers', async () => {
    const response = await axiosInstance.get('/message/users');
    return response.data.data;
    });

export const getMessages = createAsyncThunk('chat/getMessages', async (userId,thunkAPI) => {
    try {
        const response = await axiosInstance.get(`/message/${userId}`);
    return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch messages');
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
}
);

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({userId, text,image},thunkAPI) => {
    try {
        const response = await axiosInstance.post(`/message/send/${userId}`, {text,image});
    return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send message');
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send message');
        
    }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
      setSelectedUser(state, action) {
        state.selectedUser = action.payload;
      },
      addMessage(state, action) {
        state.messages.push(action.payload);
      },
      subscribeToMessages(state, action) {
        const { socket } = action.payload; // Pass socket from your app's state
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
            toast.error('Failed to load messages');
          state.isMessagesLoading = false;
        });
  
      builder
        .addCase(sendMessage.pending, (state) => {
          // Optional: Add loading state for sending messages
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
          state.messages.push(action.payload);
        })
        .addCase(sendMessage.rejected, (state) => {
          // Handle error if needed
          toast.error('Failed to send message');
        });
    },
  });
  
  export const { setSelectedUser, addMessage, subscribeToMessages, unsubscribeFromMessages } = chatSlice.actions;
  
  export default chatSlice.reducer;
  