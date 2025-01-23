import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFriends, setSelectedUser } from '../redux/features/friendsSlice';
import { updateOnlineFriends } from '../redux/features/userAuthSlice';
import { Users } from 'lucide-react';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { useTranslation } from 'react-i18next';

const Sidebar = ({sidebar,setSidebar}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { users, isUsersLoading, selectedUser } = useSelector((state) => state.friends);
  const { onlineUsers, socket } = useSelector((state) => state.userAuth);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
  useEffect(() => {
    dispatch(getFriends());
  }, [dispatch]);

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

  // Create a copy of users to sort and avoid directly modifying the state
  const sortedUsers = [...users]?.sort((a, b) => {
    const lastInteractionA = a?.lastInteractionDate ? new Date(a?.lastInteractionDate) : 0;
    const lastInteractionB = b?.lastInteractionDate ? new Date(b?.lastInteractionDate) : 0;
    return lastInteractionB - lastInteractionA; // Sort in descending order
  });

  const filteredUsers = showOnlineOnly 
    ? sortedUsers.filter((user) => onlineUsers.includes(user?.friend._id))
    : sortedUsers;

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }
  // {t('sidebar.group')}
  console.log(filteredUsers)
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        {sidebar && (<div className="flex hover:bg-base-300 w-36 p-2 rounded-md hover:cursor-pointer items-center gap-2" onClick={()=>setSidebar(x=>!x)}>
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">{t('sidebar.contacts')}</span>
        </div>)}

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">{t('sidebar.showOnlineOnly')}</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} {t('sidebar.online')})</span>
        </div>
        
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => dispatch(setSelectedUser(user))}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user.friend?._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.friend?.profilePicture || "/avatar.jpg"}
                  alt={user.friend?.name || "User"}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user.friend?._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.friend?.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user.friend?._id) ? t('sidebar.online') : t('sidebar.offline')}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? t('sidebar.noOnlineUsers') : t('sidebar.noUsersAvailable')}
          </div>
        )}
      </div>
    </aside>
  );
};


export default Sidebar;
