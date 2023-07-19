import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../auth/firebaseConfig';
import {arrayUnion, collection, doc, getDoc, setDoc, updateDoc} from 'firebase/firestore/lite';
import Nav from './Nav';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Image, Avatar } from 'antd';
import { CommentOutlined, RightOutlined, BarsOutlined, SmileOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function Comments() {
  const [commentText, setComment] = useState('')
  const {id} = useParams();
  const [reqPost, setReqPost] = useState(null)
  const [loading, setloading] = useState(false)
  const Allposts = useSelector((state)=> state.reducerPost.userPosts) 
  const user = useSelector((state)=> state.reducer.copyUserdata)
  const [cPost, setcPost] = useState([]);
  const specificPost = Allposts.filter((items)=> items.Id === id)
  console.log(specificPost)
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
    setloading(false)
    const commentRef = doc(db, "users", id)
    updateDoc(commentRef,{
      comments: arrayUnion({
        commnetProfile: user.name,
        commentPhoto:user.photo,
        comment: commentText,
      })
    })
  }
  useEffect(()=> getComments, [loading])
  console.log(cPost)
  return (
    <main className= 'flex bg-main text-dim-white min-h-screen'>
      <div>
        <Nav/>
      </div>
        <div className='w-9/12'>
                {specificPost.map((item)=> {
                  return <section to={`/comments/${item.Id}`} className='bg-secondary w-full ml-14 rounded-xl flex my-5 justify-between'>
                    <div className='w-1/2 flex flex-col justify-between'>
                      <div className='flex flex-col'>
                      <div className='w-full flex items-satrt justify-between mt-3 border-b-2 pb-5 border-dimest'>
                        <div className='flex ml-3 items-center'>
                          <Image src={item.userPhoto} className='rounded-full' preview={false} width={60}/>
                          <div className='flex flex-col items-start mx-3'>
                            <h1 className='text-dim-white font-semibold'>{item.userName}</h1>
                            <p className='italic text-xs font-bold'>@harisak</p>
                            <p className='text-xs text-dim-white my-2 font-semibold'>{item.description}</p>
                          </div>
                        </div>
                        <div className='mr-5'>
                          <Avatar icon={<BarsOutlined />} className='bg-secondary'/>
                        </div>
                      </div>
                        <div className=' flex-col flex'>
                          {cPost.map((cmnt)=> {
                            return <div className='my-2 ml-3 flex items-center'>
                              <Avatar src={cmnt.commentPhoto} size={'small'}/>
                              <p className='text-xs font-bold text-dim-white mx-2'>{cmnt.commnetProfile} :</p>
                              <p className='text-xs font-medium opacity-80 text-dim-white'>{cmnt.comment}</p>
                            </div>
                          })}
                        </div>
                      </div>
                        <div className='w-full mb-4 ml-2 flex flex-col items-start justify-center'>
                              <div className='flex items-center'>
                                <Avatar  src={user.photo} className=''/>
                              <h1 className='text-xs font-bold mx-2'>{user.name}</h1>
                              </div>
                              <div className='flex items-end w-full'>
                              <input type="text" name="comment" onChange={(e)=> setComment(e.target.value)} id="comment" className='w-9/12 appearance-none border-b-2 bg-transparent border-dim-white placeholder:italic pl-2 focus:outline-0 hover:outline-0' placeholder='write a comment....'/>
                              <button type='submit' onClick={handleComment} className=' m-auto rounded w-1/6 pb-1'><RightOutlined /></button>
                              </div>
                        </div>  
                    </div>
                  <div className='w-3/5 flex'>
                    <Image src={item.post_image} className='rounded-xl '/>
                  </div> 
                  </section>
                })}
              </div>
    </main>
  )
}

export default Comments