import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFriends, setSelectedUser } from '../redux/features/friendsSlice';
import { Users } from "lucide-react";
import SidebarSkeleton from './skeletons/SidebarSkeleton';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { users, isUsersLoading, selectedUser } = useSelector((state) => state.friends);
  const { onlineUsers } = useSelector((state) => state.userAuth);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
console.log(users);
  useEffect(() => {
    dispatch(getFriends());
  }, [dispatch]);

  const filteredUsers = showOnlineOnly 
    ? users.filter((user) => onlineUsers.includes(user?._id)) 
    : users;

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
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
              <div onClick={()=>console.log(user)} className="relative mx-auto lg:mx-0">
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
                  {onlineUsers.includes(user.friend?._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? "No online users" : "No users available"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
