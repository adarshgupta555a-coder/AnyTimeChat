import React from 'react'
import { useEffect } from 'react'

const Home = () => {

  useEffect(() => {
    fetch("http://localhost:3000/users/",{
    method: "GET",
    credentials: "include"   // ⭐ MUST AGAIN
}).then(res=>res.json())
    .then(data=>console.log(data) );
  }, [])
  return (
    <div>
      <h1 className='text-center text-red-500'>Hello world</h1>
    </div>
  )
}

export default Home
