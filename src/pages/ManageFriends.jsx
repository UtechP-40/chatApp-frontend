import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFriend, getFriends, setSelectedUser } from '../redux/features/friendsSlice';
import { MoreHorizontal } from 'lucide-react';
import ManageFriendsSkeleton from '../Components/skeletons/ManageFriendsSkeleton';
import { useTranslation } from 'react-i18next';

const ManageFriends = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading } = useSelector((state) => state.friends);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    dispatch(getFriends());
  }, [dispatch]);

  const handleRemoveFriend = async (friendId, email) => {
    await dispatch(removeFriend({ friendId, email }));
    await dispatch(getFriends())
    setMenuOpen(null);
  };

  const handleChatWithUser = (friend) => {
    dispatch(setSelectedUser(friend));
    navigate('/');
    setMenuOpen(null);
  };
  console.clear()
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-2xl font-bold mb-6">{t('manageFriends.title')}</h1>

      {isLoading ? (
        <ManageFriendsSkeleton />
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-base-100 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.friend.profilePicture || '/avatar.jpg'}
                  alt={user.friend.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{user.friend.fullName}</span>
                  <span className="text-sm text-zinc-500">{user.friend.email}</span>
                </div>
              </div>
              <div className="relative">
                <button
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                  onClick={() => setMenuOpen(menuOpen === user._id ? null : user._id)}
                  aria-label={t('manageFriends.menuOptions')}
                >
                  <MoreHorizontal />
                </button>
                {menuOpen === user._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleRemoveFriend(user.friend._id, user.friend.email)}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 transition"
                    >
                      {t('manageFriends.removeFriend')}
                    </button>
                    <button
                      onClick={() => handleChatWithUser(user)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    >
                      {t('manageFriends.chatWithUser')}
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
