import React from 'react'
import { useSelector } from 'react-redux'
import Nav from './Nav'
import {Avatar} from 'antd'
import {PictureFilled,BookFilled} from '@ant-design/icons'
import { useState, useEffect } from 'react'

function Profile() {
  const user = useSelector((state)=> state.reducer.userdata);
  const [photos, setPhotos] = useState([])
    const [loading, setloading] = useState(true)
    const api_key = '6hQbAQHftoja1nH9XPBCJ3g5vUrFBFPTIqmloRdxT5gih1o5aTFgQFQq' 
  const fetchImage = async() => {
    setloading(true)
    try{    
        const response = await fetch('https://api.pexels.com/v1/curated?&per_page=40',{headers:{Authorization: api_key}})
        const data = await response.json();
        setPhotos(data.photos);
        if (data){
         setloading(false)   
        }
    }catch(error){
        console.log(error);
    }
  }
  useEffect(()=>fetchImage,[])
  console.log(user);
  const username = user.email.substr(0,user.email.indexOf('@'));
  return (
    <section>
      <Nav/>
      {/* <div className='flex flex-col justify-center items-center mt-10'>
      <Avatar size={'large'} draggable='false' shape='square' className='drop-shadow-4xl' src={user.photoURL} alt={user.email}/>
      <h1 className='text-2xl subpixel-antialiased antialiased'>{user.displayName}</h1>
      <p className='italic subpixel-antialiased antialiased'>@{username}</p>
      <p className='text-xl font-thin text-gray-500 subpixel-antialiased antialiased'>
        <span className='italic text-2xl'>"</span>
        Man Child in the promised Land
        <span className='italic text-2xl'>"</span>
      </p>
      </div>
      <div className='grid grid-cols-4 justify-evenly mt-10 w-4/6 m-auto border-4 bg-blue-200 rounded-lg'>
        {photos?.map((element)=>
                  <img src={element.src.portrait} className='border-2 rounded-lg' alt={element.alt} key={element.id}/>
        )}
      </div> */}
    </section>
  )
}

export default Profile