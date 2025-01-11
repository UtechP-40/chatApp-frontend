import React from 'react'
import Navbar from './Components/Navbar'
import { Routes, Route,useNavigate,Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'

import { useEffect } from 'react'
import {useDispatch,useSelector} from "react-redux"
import { checkAuth } from './redux/features/userAuthSlice'
import {Toaster} from 'react-hot-toast'
import {Loader} from "lucide-react"

function App() {
  // console.log(axiosInstance);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {authUser,isCheckingAuth} = useSelector(store=>store.userAuth)
  // console.log(authUser);
  useEffect(()=>{
    dispatch(checkAuth())
    
  }
  ,[dispatch])
  console.log(authUser)
  // useEffect(() => {
  //   // Redirect to login if the user is not authenticated
  //   if (!isCheckingAuth && !authUser) {
  //     navigate('/login');
  //   }
  // }, [authUser, isCheckingAuth, navigate]);
  // console.log(isCheckingAuth,authUser);
  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }
 
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser?<HomePage />:<Navigate to="/login" />} />
        <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/" />} />
        <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/"/>} />
        <Route path="/settings" element={authUser?<SettingsPage />:<Navigate to="/login" />} />
        <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
