import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToMessages, unsubscribeFromMessages, getMessages } from "../redux/features/chatSlice";
import { deleteMessage } from "../redux/features/chatSlice";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { MoreVertical, Trash2, Reply } from "lucide-react";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const { messages, isMessagesLoading } = useSelector((state) => state.chat);
  const { selectedUser } = useSelector((state) => state.friends);
  const { authUser, socket } = useSelector((state) => state.userAuth);
  const [replyTo, setReplyTo] = useState(null);
  const messageEndRef = useRef(null);
  const messageRefs = useRef({});

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser.friend._id));
      dispatch(subscribeToMessages({ socket }));
      return () => {
        dispatch(unsubscribeFromMessages({ socket }));
      };
    }
  }, [selectedUser, dispatch, socket]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleDeleteMessage = (messageId) => {
    dispatch(deleteMessage(messageId));
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const scrollToMessage = (messageId) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) return "Today";
    if (isYesterday(messageDate)) return "Yesterday";
    return format(messageDate, "d/M/yyyy"); // Full date
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const dateKey = formatMessageDate(message.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(message);
    return acc;
  }, {});

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            {/* Date Divider */}
            <div className="text-center text-xs font-semibold text-gray-500 py-2">
              {date}
            </div>
            {messages.map((message) => (
              <div key={message._id}>
                <div
                  ref={(el) => (messageRefs.current[message._id] = el)}
                  className={`chat ${
                    message.senderId === authUser._id ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="size-10 rounded-full border">
                      <img
                        src={
                          message.senderId === authUser._id
                            ? authUser.profilePicture || "/avatar.jpg"
                            : selectedUser.profilePicture || "/avatar.jpg"
                        }
                        alt="profile pic"
                      />
                    </div>
                  </div>
                  <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 ml-1">
                      {format(new Date(message.createdAt), "hh:mm a")}
                    </time>
                  </div>
                  <div className="chat-bubble group relative">
                    {/* Display replied-to message */}
                    {message.replyTo && (
                      <div
                        className="text-xs italic border-l-2 border-gray-400 pl-2 mb-1 text-gray-600 cursor-pointer"
                        onClick={() => scrollToMessage(message.replyTo._id)}
                      >
                        {message.replyTo.text && (
                          <p className="whitespace-normal break-words">
                            {message.replyTo.text}
                          </p>
                        )}
                      </div>
                    )}
                    {/* Message content */}
                    {message.text && (
                      <p className="whitespace-normal break-words">
                        {message.text}
                      </p>
                    )}
                    {/* Three-dot menu */}
                    <div className="absolute top-1 right-1 z-10 hidden group-hover:block">
                      <div className="dropdown dropdown-left">
                        <button tabIndex={0} className="btn btn-circle btn-sm">
                          <MoreVertical size={18} />
                        </button>
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
                          <li onClick={() => handleDeleteMessage(message._id)}>
                            <a>
                              <Trash2 size={16} />
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
    </div>
  );
};

export default ChatContainer;
