import { useEffect, useRef } from "react";
import {subscribeToMessages, unsubscribeFromMessages,getMessages} from "../redux/features/chatSlice";
import {useDispatch, useSelector} from "react-redux";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const { messages, isMessagesLoading} = useSelector((state) => state.chat);
  const {selectedUser} = useSelector(state=>state.friends)
  const {authUser,socket} = useSelector((state) => state.userAuth);
  const messageEndRef = useRef(null);
console.log(selectedUser)
  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser.friend._id));
      dispatch(subscribeToMessages({socket}));
      return () => {
        dispatch(unsubscribeFromMessages({socket}));
      };
    }

    

  }, [selectedUser, dispatch, socket]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
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
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
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
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p className="whitespace-normal break-words">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer
