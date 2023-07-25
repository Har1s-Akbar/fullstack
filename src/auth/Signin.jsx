import React from 'react';
import { useState,useEffect } from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from './firebaseConfig';
import {useDispatch } from 'react-redux';
import { setUser } from '../store/slice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Signin() {
    const [photos, setPhotos] = useState([]);
    const [loading, setloading] = useState(true);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const dispatch = useDispatch()
    const api_key = '6hQbAQHftoja1nH9XPBCJ3g5vUrFBFPTIqmloRdxT5gih1o5aTFgQFQq';
    const signIn = (event) =>{
        event.preventDefault();
        signInWithEmailAndPassword(auth, email,password,).then((userCred)=>{
            const user = userCred.user;
            dispatch(setUser(user));
            navigate('/feed')
        }).catch((error)=> {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
    }
  const fetchImage = async() => {
    setloading(true)
    try{    
        const response = await fetch('https://api.pexels.com/v1/search?query=people&per_page=80',{headers:{Authorization: api_key}})
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
  return (
    <section className='h-screen overflow-hidden grid grid-cols-2 m-auto '>
        <motion.div className='flex flex-col items-center justify-center rounded drop-shadow-2xl bg-orange-50 outline-8 outline-slate-500 border-amber-100 m-auto border-black w-4/5 h-2/3'
                initial={{y:-2000}}
                animate={{y:-1000}}
                transition={{duration:6,delay:0.6, ease:"easeInOut"}}        
        >
            <div>
                <h1 className='text-3xl font-semibold my-5 text-center'>Welcome Back, Log in</h1>
                <p className='font-thin text-sm my-10 text-center'>Enter your credentials to Log in your account</p>
            </div>
            <div>
                <form onSubmit={signIn} className='flex flex-col'>
                    <label htmlFor="email" className='font-semibold my-2 text-base subpixel-antialiased antialiased'>Email</label>
                    <input type="email" onChange={(e)=> setEmail(e.target.value)} name="email" id="email" className='appearance-none border-b-2 bg-transparent border-black placeholder:italic pl-2 focus:outline-0 hover:outline-0' placeholder='email@gmail.com'/>

                    <label htmlFor="password" className='font-semibold  text-base mt-6 my-2 subpixel-antialiased antialiased'>Password</label>
                    <input type="password" name="password" id="password" onChange={(e)=> setPassword(e.target.value)} className='appearance-none border-b-2 border-black bg-transparent placeholder:italic pl-2 focus:outline-0 hover:outline-0' placeholder='password'/>

                    <button type='submit' className='border-2 border-black mt-10 w-1/2 m-auto rounded py-1 hover:bg-black hover:text-white transition delay-100 duration-300'>Log In</button>
                </form>
            </div>
        </motion.div>
        <motion.div className='grid grid-cols-6 bg-black'
        initial={{y:600}}
        animate={{y:-500}}
        transition={{duration:6,delay:0.6, ease:"easeInOut"}}
        >
            {photos?.map((element)=>
                <img src={element.src.portrait} className='border-amber-100 border-2' alt={element.alt} key={element.id}/>
            )}
        </motion.div>
    </section>
  )
}

export default Signin