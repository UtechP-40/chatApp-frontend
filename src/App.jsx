import React, { useEffect } from 'react';
import Navbar from './Components/Navbar';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, connectSocket, disconnectSocket } from './redux/features/userAuthSlice';
import { Toaster } from 'react-hot-toast';
import { Loader } from "lucide-react";

// Pages
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import Themes from './pages/Themes';
import Language from './pages/Language';
import ManageFriends from './pages/ManageFriends';
import PrivacySettings from './pages/PrivacySettings';
import Notifications from './pages/Notifications';
// import DownloadData from './pages/DownloadData';
import HelpSupport from './pages/HelpSupport';
import Accessibility from './pages/Accessibility';
import ProfilePage from './pages/ProfilePage';
import Search from './pages/Search';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser, isCheckingAuth } = useSelector(store => store.userAuth);
  const { theme } = useSelector(store => store.userTheme);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(connectSocket());

    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className='size-10 animate-spin' />
      </div>
    );
  }

  const routes = [
    { path: "/", element: <HomePage />, restricted: true },
    { path: "/search", element: <Search />, restricted: true },
    { path: "/signup", element: <SignUpPage />, restricted: false },
    { path: "/login", element: <LoginPage />, restricted: false },
    { path: "/settings", element: <SettingsPage />, restricted: true },
    { path: "/settings/theme", element: <Themes />, restricted: true },
    { path: "/settings/language", element: <Language />, restricted: true },
    { path: "/friends", element: <ManageFriends />, restricted: true },
    { path: "/settings/privacy", element: <PrivacySettings />, restricted: true },
    { path: "/settings/notifications", element: <Notifications />, restricted: true },
    // { path: "/settings/download-data", element: <DownloadData />, restricted: true },
    { path: "/settings/help", element: <HelpSupport />, restricted: true },
    { path: "/settings/accessibility", element: <Accessibility />, restricted: true },
    { path: "/profile", element: <ProfilePage />, restricted: true },
  ];

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        {routes.map(({ path, element, restricted }) => (
          <Route
            key={path}
            path={path}
            element={restricted && !authUser ? <Navigate to="/login" /> : element}
          />
        ))}
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
