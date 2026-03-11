import React from 'react'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/AuthStore';
import {getVerifyUser} from "../utils/getVerifyUser"
import { Link } from 'react-router-dom';

const Home = () => {
  const {setAuth,user} = useAuthStore();

  useEffect(() => {
    getVerifyUser().then((data)=>{
      console.log(data)
      setAuth(data)

    })
  }, [])

 
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">

    <h1 className="text-2xl md:text-3xl font-bold text-red-500 mb-6">
      {user?.username}
    </h1>

    {user?.username && (
      <Link to="/chatroom">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-300">
          Go to the Chatroom
        </button>
      </Link>
    )}

  </div>
</div>
  )
}

export default Home
