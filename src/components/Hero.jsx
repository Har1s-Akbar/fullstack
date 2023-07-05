import React, { useEffect } from 'react';
import {motion} from 'framer-motion'
import { useState } from 'react';
import Login from '../auth/Login';
function Hero() {
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
  console.log(loading)
    return (
        loading ? <div><h1>Loading...</h1></div>:
    <section className='w-full h-screen overflow-hidden relative grid gap-x-8 gap-y-4 items-center bg-black'>
        {/* bg-gradient-to-r from-left to-right */}
        <motion.div className='grid grid-cols-8 m-auto'
            
            initial={{y:250, scale:1}}
            animate={{y:-500, scale:[1.5]}}
            transition={{duration:6,delay:0.6, ease:"easeInOut"}}
            >
            {photos?.map((element)=>
                <img src={element.src.portrait} className='border-gray-50 border-2 brightness-50 even:saturate-100 odd:grayscale' alt={element.alt} key={element.id}/>
            )}
        </motion.div>
        <motion.div className='absolute w-1/2 bottom-1/3 left-1/4'
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:2, delay:4}}
        >
            <div className=' flex flex-col justif-center items-center'>
                <h1 className='text-white subpixel-antialiased antialiased tracking-wider font-semibold text-3xl leading-10 text-center w-5/6 my-10 '>
                    Join the community &
                    share your moments with people!! 
                </h1>
                <Login/>
            </div>
        </motion.div>
    </section>
  )
}

export default Hero