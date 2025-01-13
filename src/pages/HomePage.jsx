// import React from 'react'
// import {setSelectedUser} from '../redux/features/chatSlice';
import { useSelector} from 'react-redux';
import Sidebar from '../Components/Sidebar';
import NoChatSelected from '../Components/NoChatSelected';
import ChatContainer from '../Components/ChatContainer';

// import {useEffect} from 'react';
// import {getUsers} from '../redux/features/chatSlice';
function HomePage() {
  const {selectedUser} = useSelector((state) => state.chat);
  console.log("hello");
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
