import React from 'react';
import sign from '../asset/sign.svg'
import Login from '../auth/Login';

function Hero() {
  return (
    <section className='w-full grid gap-x-8 gap-y-4 items-center grid-cols-2 h-screen bg-gradient-to-r from-blue-500 to-white'>
        <div className=' w-4/6 m-auto'>
            <h1 className='text-4xl text-white leading-loose'>
                Join The NightGale Right Now!!
            </h1>
            <p className='text-md leading-loose text-white w-5/6'>
                Meet New persons. Communicate with Others through photos and comments.
            </p>
        </div>
        <div className='w-4/6 flex flex-col justify-center items-center'>
            <img src={sign} alt="" />
            <Login />
        </div>
    </section>
  )
}

export default Hero