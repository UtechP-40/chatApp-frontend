import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGroup,getGroups } from "../redux/features/groupSlice";
import CreateGroupModal from "./CreateGroupModel";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import {updateOnlineFriends} from "../redux/features/userAuthSlice"
// import { useSelector } from "react-redux";
const GroupSidebar = ({ sidebar, setSidebar }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { groups, selectedGroup } = useSelector((state) => state.groups);
  const {socket} =useSelector(state => state.userAuth.socket)
  const [showCreateModal, setShowCreateModal] = useState(false);
useEffect(()=>{
  dispatch(getGroups())
},[dispatch])
useEffect(() => {
  if (!socket) return;

  const handleOnlineUsers = (onlineUserIds) => {
    dispatch(updateOnlineFriends(onlineUserIds));
  };

  socket.on('getOnlineUsers', handleOnlineUsers);

  return () => {
    socket.off('getOnlineUsers', handleOnlineUsers);
  };
}, [socket, dispatch]);
console.log(groups)
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        {sidebar || (
          <div className="flex hover:bg-base-300 w-36 p-2 rounded-md hover:cursor-pointer items-center gap-2" onClick={() => setSidebar(x => !x)}>
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">{t('sidebar.groups')}</span>
          </div>
        )}
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary btn-sm mt-4 w-full"
        >
          {t('sidebar.createGroup')}
        </button>

        <CreateGroupModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)}
        />
      </div>

      <div className="overflow-y-auto w-full py-3">
        {groups.length > 0 ? (
          groups.map((group) => (
            <button
              key={group._id}
              onClick={() => {
                // console.log(group)
                dispatch(selectGroup({ 
                group: group, 
                socket: socket,
              }))}}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <div className="size-12 bg-primary text-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Group info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{group.name}</div>
                <div className="text-sm text-zinc-400">
                  {group.members.length} {t('sidebar.members')}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">
            {t('sidebar.noGroupsAvailable')}
          </div>
        )}
      </div>
    </aside>
  );
};

export default GroupSidebar;