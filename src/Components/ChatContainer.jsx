import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToMessages, unsubscribeFromMessages, getMessages } from "../redux/features/chatSlice";
import { deleteMessage } from "../redux/features/chatSlice"; // Add this action
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { MoreVertical, Trash2, Reply } from "lucide-react";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const { messages, isMessagesLoading } = useSelector((state) => state.chat);
  const { selectedUser } = useSelector((state) => state.friends);
  const { authUser, socket } = useSelector((state) => state.userAuth);
  const [replyTo, setReplyTo] = useState(null); // For reply preview
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser.friend._id));
      dispatch(subscribeToMessages({ socket }));
      return () => {
        dispatch(unsubscribeFromMessages({ socket }));
      };
    }
  }, [selectedUser, dispatch, socket]);
// console.log(messages)
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages,dispatch]);

  const handleDeleteMessage = (messageId) => {
    dispatch(deleteMessage(messageId)); // Trigger delete action
  };

  const handleReply = (message) => {
    setReplyTo(message); // Set the message to reply to
  };
  console.clear()
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
    {messages.map((message) => (
      <div
        key={message._id}
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
            {formatMessageTime(message.createdAt)}
          </time>
        </div>
        <div className="chat-bubble group relative">
          {/* Display replied-to message */}
          {message.replyTo && (
  <div className="text-xs italic border-l-2 border-gray-400 pl-2 mb-1 text-gray-600">
    {/* Display the replied image if it exists */}
    {message.replyTo.image && (
      <img
        src={message.replyTo.image}
        alt="Replied Attachment"
        className="w-20 h-20 object-cover rounded-md mb-1"
      />
    )}
    {/* Display the replied text */}
    {message.replyTo.text && <p>{message.replyTo.text}</p>}
  </div>
)}

          {/* Message content */}
          {message.image && (
            <img
              src={message.image}
              alt="Attachment"
              className="sm:max-w-[200px] rounded-md mb-2"
            />
          )}
          <div>
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
            {message.text && (
              <p className="whitespace-normal break-words">{message.text}</p>
            )}
          </div>
        </div>
      </div>
    ))}
    <div ref={messageEndRef} />
  </div>

  <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
</div>

  );
};

export default ChatContainer;
