import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendGroupMessage } from "../redux/features/groupSlice";
import { toast } from "react-hot-toast";
import { Image, Send, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const GroupMessageInput = ({ replyTo, setReplyTo }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);
  const { authUser } = useSelector((store) => store.userAuth);
  const { selectedGroup } = useSelector((store) => store.groups);
  const { t } = useTranslation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error(t("messageInput.selectImageError"));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await dispatch(
        sendGroupMessage({
          groupId: selectedGroup._id,
          messageData: {
            text: text.trim(),
            image: imagePreview,
            replyTo: replyTo?._id || null,
          }
        })
      );

      setText("");
      setImagePreview(null);
      setReplyTo(null);
      if (textAreaRef.current) textAreaRef.current.style.height = "auto";
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send group message:", error);
    }
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };
console.log(replyTo);
  return (
    <div className="p-4 w-full">
      {replyTo && (
        <div className="mb-2 p-2 bg-blue-100 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 italic">
            {replyTo.senderId === authUser._id
              ? t("messageInput.replyingToYourself")
              : t("messageInput.replyingTo", {
                  name: replyTo.senderId?.fullName || t("common.unknownUser")
                })}
          </p>
          <p className="text-sm text-gray-700">
            {replyTo.text || t("messageInput.image")}
          </p>
          <button
            className="text-xs text-red-500 mt-1 hover:text-red-700"
            onClick={() => setReplyTo(null)}
          >Cancel
            {/* {t("common.cancel")} */}
          </button>
        </div>
      )}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt={t("messageInput.previewAlt")}
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-base-400 transition-colors"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
        <div className="flex-1 flex gap-2 items-end">
          <textarea
            ref={textAreaRef}
            className="w-full input input-bordered rounded-lg input-sm sm:input-md resize-none"
            placeholder={t("messageInput.typeMessage")}
            value={text}
            onChange={handleInputChange}
            rows={1}
            style={{
              minHeight: "40px",
              maxHeight: "120px",
              overflowY: text.length > 0 ? "auto" : "hidden",
            }}
          />
          
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
            } hover:text-emerald-600`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-circle bg-primary hover:bg-primary-focus text-primary-content"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={23} />
        </button>
      </form>
    </div>
  );
};

export default GroupMessageInput;