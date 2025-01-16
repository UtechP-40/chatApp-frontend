import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import { removeFriend, getFriends, setSelectedUser } from '../redux/features/friendsSlice'; // Import setSelectedUser action
import { MoreHorizontal } from 'lucide-react'; // Icon for the menu
import ManageFriendsSkeleton from '../Components/skeletons/ManageFriendsSkeleton';

const ManageFriends = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const { users, isLoading } = useSelector(state => state.friends);
  const [menuOpen, setMenuOpen] = useState(null); // Track open menu by user ID

  useEffect(() => {
    dispatch(getFriends()); // Fetch the friends list on component mount
  }, [dispatch]);

  const handleRemoveFriend = (friendId) => {
    dispatch(removeFriend(friendId)); // Dispatch the remove friend action
    setMenuOpen(null); // Close the menu after the action
  };

  const handleChatWithUser = (friend) => {
    dispatch(setSelectedUser(friend)); // Set the selected user in Redux
    navigate('/'); // Redirect to the home page
    setMenuOpen(null); // Close the menu
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Friends</h1>

      {/* Loading state */}
      {isLoading ? (
        <ManageFriendsSkeleton />
      ) : (
        <div className="space-y-4">
          {/* Displaying the list of friends */}
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-base-100 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                {/* Profile Picture */}
                <img
                  src={user.friend.profilePicture || "/avatar.jpg"}
                  alt={user.friend.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {/* Friend Info */}
                <div className="flex flex-col">
                  <span className="font-semibold">{user.friend.fullName}</span>
                  <span className="text-sm text-zinc-500">{user.friend.email}</span>
                </div>
              </div>

              {/* Menu Dropdown */}
              <div className="relative">
                <button
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                  onClick={() => setMenuOpen(menuOpen === user._id ? null : user._id)}
                  aria-label="Options"
                >
                  <MoreHorizontal />
                </button>

                {menuOpen === user._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleRemoveFriend(user._id)}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 transition"
                    >
                      Remove Friend
                    </button>
                    <button
                      onClick={() => handleChatWithUser(user)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Chat with User
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageFriends;
