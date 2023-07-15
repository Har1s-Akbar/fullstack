import React from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../auth/firebaseConfig';
import {collection, doc, setDoc} from 'firebase/firestore/lite';
import Nav from './Nav';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Image, Avatar } from 'antd';
import { CommentOutlined, RightOutlined } from '@ant-design/icons';

function Comments() {
  const [commentText, setComment] = useState('')
  const {id} = useParams();
  const Allposts = useSelector((state)=> state.reducerPost.userPosts) 
  const user = useSelector((state)=> state.reducer.userdata)
  const commentPost = Allposts.filter((item)=> item.Id === id)
  const handleComment= async(event)=>{
    event.preventDefault();
    // setDoc(doc(db, "comments", id),{
    //   commentId: id,
    //   photoUrl :user.photoURL,
    //   name: user.displayName,
    //   comment: commentText
    // }).then((data)=> console.log('comment added')).catch((error)=> console.log(error))
  }
  return (
    <main className='flex'>
      <Nav/>
      <div className=' m-auto grid grid-cols-2'>
        <div>
          <h1 className='text-5xl font-mono '>Post</h1>
          {commentPost.map((item, index)=> {
                return <div className='mt-10 flex flex-col'>
                    <div key={index}>
                        <div className='flex ' key={index}>
                            <Avatar src={item.userPhoto} size={'large'} className='border-2 border-orange-300' alt={item.userName}/>
                            <h1 className='font-mono mx-2 font-thin'>{item.userName}</h1>
                        </div>
                        <div>
                            <h1 className='font-medium text-xl my-3 border-l-2 border-black pl-2'>{item.description}</h1>
                            <Image src={item.post_image} className='rounded drop-shadow-xl border-2 border-yellow-200' 
                            width={400} alt={item.userName} fallback='https://shorturl.at/IKMT0' />  
                        </div>
                    </div>
                    <div className=''>
                        <button className='px-6 border-x-2 border-t-2 py-2 rounded flex justify-center items-center'>
                            <h1 className='text-md mx-2'>Comments</h1>
                            <CommentOutlined style={{fontSize:'20px'}} />
                        </button>
                        <div className='border-2 rounded p-5 border-2 bg-teal-400'>
                          <div className='border-2 p-3 rounded bg-stone-400 opacity-90 shadow-2xl'>
                            <div className='flex items-center '>
                              <Avatar src={item.userPhoto} className='border-2 border-orange-300'/>
                              <h1 className='mx-2 font-medium'>{item.userName}</h1>
                            </div>
                            <div className='my-3 text-base'>
                              <h1 className='ml-2'>
                                Hey this is a great Post!!!
                              </h1>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            })}
        </div> 
        <div className='m-auto ml-10'>
          <div>
            <h1 className='text-4xl font-mono'>Create a Comment</h1>
          </div>
            <form className='flex flex-col' onSubmit={handleComment}>
                      <label htmlFor="comment" className='font-semibold my-2 text-base subpixel-antialiased antialiased'>Comment</label>
                      <div className='flex '>
                          <input type="text" name="comment" onChange={(e)=> setComment(e.target.value)} id="comment" className='appearance-none border-b-2 bg-transparent border-black placeholder:italic pl-2 focus:outline-0 hover:outline-0' placeholder='write a comment....'/>

                          <button type='submit' className=' m-auto rounded w-1/6 pb-1 hover:bg-black hover:text-white transition delay-100 duration-300'><RightOutlined /></button>
                      </div>
            </form>
        </div>
      </div>
    </main>
  )
}

export default Comments