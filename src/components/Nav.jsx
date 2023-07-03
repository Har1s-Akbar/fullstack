import React from 'react'
import Login from '../auth/Login'

function Nav() {
  return (
    <nav className='bg-blue-400 flex justify-center py-4 items-center'>
        <div className='w-2/6'>
            <h1 className='text-3xl text-white font-bold'>
                NightGale
            </h1>
        </div>
        <div className='ml-10 w-2/6'>
            <ul className='flex justify-between items-center'>
                <a href="" className='px-4 text-md text-white'>Home</a>
                <a href="" className='px-4 text-md text-white'>Feed</a>
                <a href="" className='px-4 text-md text-white'>About</a>
                <a href="" className='px-4 text-md text-white'>Careers</a>
                <Login className='ml-10'/>
            </ul>
        </div>
    </nav>
  )
}

export default Nav