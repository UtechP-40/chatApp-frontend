import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../redux/features/chatSlice";
import { toast } from "react-hot-toast";
import { Image, Send, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const MessageInput = ({ replyTo, setReplyTo }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null); // Ref for the textarea
  const { authUser } = useSelector((store) => store.userAuth);
  const { t } = useTranslation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error(t("messageInput.selectImageError"));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
  
    try {
      await dispatch(
        sendMessage({
          text: text.trim(),
          image: imagePreview,
          replyTo:replyTo?._id || null, // include replyTo in the payload
        })
      );
      console.log(replyTo)
      // Reset after sending message
      setText("");
      setImagePreview(null);
      setReplyTo(null);  // Reset the reply state after sending the message
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto"; // Reset height
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height before adjusting
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust height dynamically
    }
  };
  console.clear()
  return (
    <div className="p-4 w-full">
      {replyTo && (
        <div className="mb-2 p-2 bg-gray-100 rounded-lg border border-gray-300">
          <p className="text-xs text-gray-600 italic">Replying to:</p>
          <p className="text-sm">{replyTo.text || "Image"}</p>
          <button
            className="text-xs text-red-500 mt-1"
            onClick={() => setReplyTo(null)}
          >
            Cancel
          </button>
        </div>
      )}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
        <div className="flex-1 flex gap-2 items-end">
          {/* Resizable Textarea */}
          <textarea
            ref={textAreaRef} // Attach ref to the textarea
            className="w-full input input-bordered rounded-lg input-sm sm:input-md resize-none"
            placeholder={t("messageInput.typeMessage")}
            value={text}
            onChange={handleInputChange}
            rows={1}
            style={{
              minHeight: "40px", // Minimum height for a consistent look
              maxHeight: "120px", // Maximum height
              overflowY: text.length > 0 ? "auto" : "hidden", // Show scrollbar only when needed
            }}
          />
          {/* File Upload Button */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={23} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
