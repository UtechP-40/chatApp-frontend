import React,{useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectGroup } from '../redux/features/groupSlice'
import { X } from "lucide-react";

const GroupChatHeader = () => {
  const dispatch = useDispatch()
  const { selectedGroup } = useSelector(store => store.groups)
  const { onlineUsers,socket } = useSelector(store => store.userAuth)

  // useEffect(()=>{

  // },[])
  // Calculate online members (if tracking member online status)
  const onlineMembers = selectedGroup?.members.filter(member => 
    onlineUsers.includes(member?.user?._id)
  ).length || 0
  // console.log(selectedGroup)
// const onlineMembers =0;
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Group Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="text-xl font-bold">
                {selectedGroup?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Group Info */}
          <div>
            <h3 className="font-medium">{selectedGroup?.name}</h3>
            <p className="text-sm text-base-content/70">
              {selectedGroup?.members.length} members • 
              {onlineMembers} online
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => dispatch(selectGroup(null))}>
          <X />
        </button>
      </div>
    </div>
  )
}

export default GroupChatHeader