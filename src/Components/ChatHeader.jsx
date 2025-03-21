import React from 'react'
import {setSelectedUser} from '../redux/features/friendsSlice'
import {useDispatch,useSelector} from 'react-redux'
import { X } from "lucide-react";
const ChatHeader = () => {
  const dispatch = useDispatch()
  const {selectedUser} = useSelector(store=>store.friends)
  const {onlineUsers} = useSelector(store=>store.userAuth)
  // console.clear()
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.friend.profilePicture || "/avatar.jpg"} alt={selectedUser.friend.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.friend.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser.friend._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => dispatch(setSelectedUser(null))}>
          <X />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
