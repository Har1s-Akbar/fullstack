import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../auth/firebaseConfig';
import {arrayUnion, collection, doc, getDoc, setDoc, updateDoc} from 'firebase/firestore/lite';
import Nav from './Nav';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Image, Avatar } from 'antd';
import { CommentOutlined, RightOutlined, BarsOutlined, SmileOutlined, MessageOutlined } from '@ant-design/icons';

function Comments() {
  const [commentText, setComment] = useState('')
  const {id} = useParams();
  const [reqPost, setReqPost] = useState(null)
  const [loading, setloading] = useState(false)
  const Allposts = useSelector((state)=> state.reducerPost.userPosts) 
  const user = useSelector((state)=> state.reducer.copyUserdata)
  const [cPost, setcPost] = useState(null);
  // const commentPost = Allposts.filter((item)=> item.Id === id)
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
        commnetProfile: user.name,
        commentPhoto:user.photo,
        comment: commentText,
      })
    })
  }
  useEffect(()=> getComments, [cPost, loading])
  return (
    <main className= 'flex bg-main text-dim-white min-h-screen'>
      <div>
        <Nav/>
      </div>
      <div className=' bg-secondary rounded-xl py-10 px-2 m-auto w-1/2'>
        {
          Allposts.map((item)=> {
            return <div className='w-full'>
              <div className='flex items-center w-full'>
                <div className='flex items-center w-full'>
                  <Image src={item.userPhoto} width={60} className='rounded-full'/>
                  <div className='flex items-start flex-col ml-3'>
                    <h1 className='text-xl text-dim-white font-medium'>{item.userName}</h1>
                    <p className='text-xs text-sim-white font-bold italic opacity-90'>@harisak</p>
                  </div>
                </div>
                <div className='mr-5'>
                  <Avatar icon={<BarsOutlined />} className='bg-secondary'/>
                </div>
              </div>
              <div>
                <h1 className='text-xl my-3 ml-2 text-dim-white font-semibold'>{item.description}</h1>
              </div>
              <div className='mt-2'>
                  <Image src={item.post_image} className='rounded-md'/>
              </div>
              <div className='flex items-center justify-center'>
                {/* <div className='mx-32'>
                  <Avatar icon={<SmileOutlined />} className='bg-secondary'/>
                </div>
                <div className='mx-32'>
                  <Avatar icon={<MessageOutlined />} className='bg-secondary'/>
                </div> */}
              </div>
            </div>
          })
        }
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

    </main>
  )
}

export default Comments