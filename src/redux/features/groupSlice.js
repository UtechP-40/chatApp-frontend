import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

// Utility function for auth headers
const addAuthHeaders = (config = {}) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return config;
};

// Async Thunks
export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/group/create-group",
        groupData,
        addAuthHeaders()
      );
      toast.success("Group created successfully");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteGroupMessage = createAsyncThunk(
  "groups/deleteGroupMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/group/messages/${messageId}`,
        addAuthHeaders()
      );
      toast.success("Message deleted");
      return messageId;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getGroups = createAsyncThunk(
  "groups/getGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/group/get-groups",
        addAuthHeaders()
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const sendGroupMessage = createAsyncThunk(
  "groups/sendGroupMessage",
  async ({ groupId, messageData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/group/send-messages/${groupId}`,
        messageData,
        addAuthHeaders()
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getGroupMessages = createAsyncThunk(
  "groups/getGroupMessages",
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/group/${groupId}/messages`,
        addAuthHeaders()
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Slice
const groupSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    selectedGroup: null,
    messages: [],
    isLoading: false,
    isMessagesLoading: false,
    error: null,
  },
  reducers: {
    selectGroup: (state, action) => {
      const { group, socket } = action.payload;
      state.selectedGroup = group;

      // Emit joinGroup event when selecting a group
      if (socket) {
        socket.emit("joinGroup", group._id);
      }
    },
    addMessageToGroup: (state, action) => {
      state.messages.push(action.payload);
    },
    resetError: (state) => {
      state.error = null;
    },
    subscribeToGroupMessages: (state, action) => {
      const { socket, groupId } = action.payload;
      if (!socket) return;

      // Subscribe to the group
      socket.emit("subscribe", groupId);

      // Listen for new group messages
      socket.on("newGroupMessage", (message) => {
        state.messages.push(message);
      });
    },
    unsubscribeFromGroupMessages: (state, action) => {
      const { socket, groupId } = action.payload;
      if (!socket) return;

      // Unsubscribe from the group
      socket.emit("unsubscribe", groupId);
      socket.off("newGroupMessage");

      // Clear messages when unsubscribing
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload.data);
        state.isLoading = false;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(getGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.groups = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getGroups.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(sendGroupMessage.fulfilled, (state, action) => {
        // state.messages.push(action.payload.data);
      })
      .addCase(sendGroupMessage.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getGroupMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getGroupMessages.fulfilled, (state, action) => {
        state.messages = action.payload.data;
        state.isMessagesLoading = false;
      })
      .addCase(getGroupMessages.rejected, (state, action) => {
        state.error = action.payload;
        state.isMessagesLoading = false;
      })

      .addCase(deleteGroupMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (message) => message._id !== action.payload
        );
      });
  },
});

export const {
  selectGroup,
  resetError,
  addMessageToGroup,
  subscribeToGroupMessages,
  unsubscribeFromGroupMessages,
} = groupSlice.actions;

export default groupSlice.reducer;