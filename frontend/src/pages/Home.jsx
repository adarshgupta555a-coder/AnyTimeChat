import React from 'react'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/AuthStore';
import {getVerifyUser} from "../utils/getVerifyUser"

const Home = () => {
  const {setAuth,user} = useAuthStore();

  useEffect(() => {
    getVerifyUser().then((data)=>{
      console.log(data)
      setAuth(data)

    })
  }, [])

 
  return (
    <div>
      <h1 className='text-center text-red-500'>{user?.username}</h1>
    </div>
  )
}

export default Home
