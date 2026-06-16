import React from 'react'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/AuthStore';
import {getVerifyUser} from "../utils/getVerifyUser"
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {
  const {setAuth,user} = useAuthStore();
  const navigate = useNavigate()

  useEffect(() => {
    getVerifyUser().then((data)=>{
      console.log(data)
      if (data.message == "Please login first") {
        toast.info("please login first")
        navigate("/signin")
      }
      setAuth(data)

    })
  }, [])

 
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">

    <h1 className="text-2xl md:text-3xl font-bold text-red-500 mb-6">
      {user?.username?user?.username:"Loading..."}
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
