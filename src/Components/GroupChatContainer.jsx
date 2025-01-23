import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribeToGroupMessages,
  unsubscribeFromGroupMessages,
  sendGroupMessage,
  addMessageToGroup,
  deleteGroupMessage,
  getGroupMessages,
} from "../redux/features/groupSlice";
import toast from "react-hot-toast";
import GroupChatHeader from "./GroupChatHeader";
import GroupMessageInput from "./GroupMessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { format, isToday, isYesterday } from "date-fns";
import { MoreVertical, Trash2, Reply } from "lucide-react";

const GroupChatContainer = () => {
  const dispatch = useDispatch();
  const { messages, selectedGroup, isMessagesLoading } = useSelector(
    (state) => state.groups
  );
  const { authUser, socket } = useSelector((state) => state.userAuth);
  const [replyTo, setReplyTo] = useState(null);
  const messageEndRef = useRef(null);
  const messageRefs = useRef({});

  // Fetch messages and setup socket connection
  useEffect(() => {
    if (selectedGroup) {
      socket.emit("joinGroup", selectedGroup._id);
      dispatch(getGroupMessages(selectedGroup._id));

      const handleNewMsg = (msg) => {
        dispatch(addMessageToGroup(msg));
      };

      socket.on("newGroupMessage", handleNewMsg);
      return () => socket.off("newGroupMessage", handleNewMsg);
    }
  }, [selectedGroup, socket, dispatch]);

  // Scroll handling
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToMessage = (messageId) => {
    const messageElement = messageRefs.current[messageId];
    messageElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Delete this message?")) {
      try {
        await dispatch(deleteGroupMessage(messageId));
        toast.success("Message deleted");
      } catch (error) {
        toast.error("Failed to delete message");
      }
    }
  };

  const handleReply = (message) => {
    console.log("hello")
    setReplyTo(message);
  };

  const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) return "Today";
    if (isYesterday(messageDate)) return "Yesterday";
    return format(messageDate, "dd/MM/yyyy");
  };

  // Group messages by date
  const groupedMessages = messages?.reduce((acc, message) => {
    const dateKey = formatMessageDate(message.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(message);
    return acc;
  }, {}) || {};

  if (!selectedGroup) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className="text-gray-500">Select a group to start chatting</p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <GroupChatHeader />
        <MessageSkeleton />
        <GroupMessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <GroupChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div className="text-center text-xs font-semibold text-gray-500 py-2">
              {date}
            </div>
            {messages.map((message) => (
              <div
                key={message._id}
                ref={(el) => (messageRefs.current[message._id] = el)}
                className={`chat ${
                  message.senderId._id === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePicture || "/avatar.jpg"
                          : message.senderId?.profilePicture || "/avatar.jpg"
                      }
                      alt="profile"
                    />
                  </div>
                </div>

                <div className="chat-header mb-1">
                  <span className="text-xs opacity-50 mr-2">
                    {message.senderId === authUser._id
                      ? "You"
                      : message.senderId?.fullName || "Unknown User"}
                  </span>
                  <time className="text-xs opacity-50">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </time>
                </div>

                <div className="chat-bubble group relative">
                  {message.replyTo && (
                    <div
                      className={`text-xs italic pl-2 mb-2 border-l-4 rounded-lg p-2 cursor-pointer ${
                        message.replyTo.senderId === authUser._id
                          ? "border-blue-400 bg-blue-100 text-right"
                          : "border-gray-400 bg-gray-100"
                      }`}
                      onClick={() => scrollToMessage(message.replyTo._id)}
                    >
                      <p className="font-medium text-xs text-gray-600">
                        {message.replyTo.senderId._id === authUser._id
                          ? "You"
                          : `${message.replyTo.senderId?.fullName || "Unknown User"}`}
                      </p>
                      <p className="whitespace-normal text-sm break-words">
                        {message.replyTo.text || "Image"}
                      </p>
                    </div>
                  )}

                  {message.text && (
                    <p className="whitespace-normal break-words">
                      {message.text}
                    </p>
                  )}

                  {message.image && (
                    <img
                      src={message.image}
                      alt="content"
                      className="mt-2 rounded-lg max-w-xs"
                    />
                  )}

                  <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="dropdown dropdown-left">
                      <button className="btn btn-circle btn-sm">
                        <MoreVertical size={18} />
                      </button>
                      {/* <ul className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40"> */}
                      <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40"
                        >
                          <li onClick={() => handleReply(message)}>
                            <a>
                              <Reply size={16} />
                              Reply
                            </a>
                          </li>
                          {/* <li onClick={() => handleDeleteMessage(message._id)}>
                            <a>
                              <Trash2 size={16} />
                              Delete
                            </a>
                          </li> */}
                        {/* </ul> */}
                        {message.senderId == authUser._id && (
                          <li onClick={() => handleDeleteMessage(message._id)}>
                            <a>
                              <Trash2 size={16} />
                              Delete
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <GroupMessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
    </div>
  );
};

export default GroupChatContainer;