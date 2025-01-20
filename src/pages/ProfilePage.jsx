import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, Mail, User } from 'lucide-react';
import { updateProfile } from '../redux/features/userAuthSlice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function ProfilePage() {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch();
  const [selectedImg, setSelectedImg] = useState(null);
  const { authUser, isUpdatingProfile } = useSelector((store) => store.userAuth);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setSelectedImg(file);
      await dispatch(updateProfile(formData));
    } catch (error) {
      toast.error(t('profilePage.imageUploadError'));
      console.error('Error uploading image:', error);
    }
  };
  console.clear()
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">{t('profilePage.title')}</h1>
            <p className="mt-2">{t('profilePage.subtitle')}</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePicture || '/avatar.jpg'}
                alt={t('profilePage.profileImageAlt')}
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? t('profilePage.uploading') : t('profilePage.updatePhoto')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('profilePage.fullName')}
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t('profilePage.email')}
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">{t('profilePage.accountInfoTitle')}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>{t('profilePage.memberSince')}</span>
                <span>{authUser.createdAt?.split('T')[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>{t('profilePage.accountStatus')}</span>
                <span className="text-green-500">{t('profilePage.active')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
