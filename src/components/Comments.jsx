import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../auth/firebaseConfig';
import {arrayUnion, collection, doc, getDoc, setDoc, updateDoc} from 'firebase/firestore/lite';
import Nav from './Nav';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Image, Avatar } from 'antd';
import { CommentOutlined, RightOutlined } from '@ant-design/icons';

function Comments() {
  const [commentText, setComment] = useState('')
  const {id} = useParams();
  const [loading, setloading] = useState(false)
  const Allposts = useSelector((state)=> state.reducerPost.userPosts) 
  const user = useSelector((state)=> state.reducer.userdata)
  const commentPost = Allposts.filter((item)=> item.Id === id)
  const [cPost, setcPost] = useState(null);
  
  const getComments = () => {
    const postRef = doc(db, "users", id)
    getDoc(postRef).then((resp) => {
      const data = resp.data();
      setcPost(data.comments)
      setloading(true)
    })
  }
  const handleComment= async(event)=>{
    event.preventDefault();
    event.target.reset();
    const commentRef = doc(db, "users", id)
    updateDoc(commentRef,{
      comments: arrayUnion({
        commnetProfile: user.displayName,
        commentPhoto:user.photoURL,
        comment: commentText,
      })
    })
  }
  useEffect(()=> getComments, [cPost, loading])
  return (
    <main className=  'flex'>
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
                        { loading ? 
                        <div className='border-2 rounded p-5 border-2 bg-teal-400'>
                        {cPost.map((item)=> {
                          return <div className='border-2 p-3 my-4 overflow-y-scroll rounded odd:bg-red-500 even:bg-blue-500 even:text-white opacity-90 shadow-2xl'>
                            <div className='flex items-center '>
                              <Avatar src={item.commentPhoto} className='border-2 border-orange-300'/>
                              <h1 className='mx-2 font-medium'>{item.commnetProfile}</h1>
                            </div>
                            <div className='my-3 text-base'>
                              <h1 className='ml-2'>
                                {item.comment}
                              </h1>
                            </div>
                          </div>
                        })}
                        </div>
                        :
                        <div><h1>comments are being Loaded....</h1></div>
                        }
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