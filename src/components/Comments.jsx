import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../auth/firebaseConfig';
import {arrayUnion, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, addDoc, query, where, getDocs} from 'firebase/firestore/lite';
import Nav from './Nav';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Image, Avatar } from 'antd';
import { EditOutlined, RightOutlined, BarsOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

function Comments() {
  const [commentText, setComment] = useState('')
  const {id} = useParams();
  const [showSetting, setSetting] = useState(false);
  const [editModal, setmodal] = useState(false);
  const [loading, setloading] = useState(false);
  const [editText, setEditText] = useState('')
  const Allposts = useSelector((state)=> state.reducerPost.userPosts); 
  const user = useSelector((state)=> state.reducer.copyUserdata);
  const [cPost, setcPost] = useState([]);
  const [specificPost, setSpecificPost] = useState([]) 
  const navigate = useNavigate();
  
  const settingShow = () => {
    if(showSetting){
      setSetting(false)
    }else{
      setSetting(true)
    }
}
const getSinglePost = async()=>{
  const Data = await getDoc(doc(db, 'users', id))
  const data = Data.data()
  setSpecificPost(data)
}
  const getComments = async() => {
    const queryRef = collection(db, "comments")
    const commentQuery = query(queryRef, where('postId' ,'==', id))
    const rawData = await getDocs(commentQuery)
    if(rawData.empty){
    setcPost([])
    }else{
      const data = rawData.docs.map((item)=> {return item.data()})
      setcPost(data)
    }
  }
  const handleComment= async(event)=>{
    event.preventDefault();
    setloading(false)
    await addDoc(collection(db, 'comments'),{
      post_useruid : user.uid,
      postId: specificPost.Id,
      commnetProfile: user.name,
      commentPhoto:user.photo,
      comment: commentText,
    })
    setloading(true)
  }
  const handleDelete = async(Id) => {
    const dltRef = doc(db, 'users', Id)
    await deleteDoc(dltRef)
    navigate('/feed')
  }
  const handleEdit = async(Id) => {
    if(!editModal){
      setmodal(true);
    }else{
      setmodal(false);
    }
  }
  const handleEditText = async(id) => {
    const editRef = doc(db, 'users', id)
    await updateDoc(editRef,{
      description: editText,
      editedAt: serverTimestamp()
    })
    setmodal(false);
    setloading(true);
    setSetting(false)
  }
  useEffect(()=> getComments, [loading])
  useEffect(()=> getSinglePost, [loading, editModal])
  return (
    <main className= 'flex bg-main text-dim-white min-h-screen relative'>
      <div>
        <Nav/>
      </div>
      <section className='flex flex-col w-full'>
      <div className='bg-secondary my-10 w-1/2 flex items-end rounded-xl m-auto'>
          <Image src={user.photo} preview={false} fallback='https://rb.gy/tebns' className='rounded-full w-1/2 opacity-80 border-2 border-dim-white my-5 ml-5' width={55}/>
          <PlusOutlined className='mb-6'/>
      </div>
        <div className={editModal ? 'opacity-50 w-9/12': 'w-9/12'}>
          <section className='bg-secondary w-full ml-14 rounded-xl flex my-5 justify-between'>
                    <div className='w-1/2 flex flex-col justify-between'>
                      <div className='flex flex-col'>
                      <div className='w-full flex items-satrt justify-between mt-3 border-b-2 pb-5 border-dimest'>
                        <div className='flex ml-3 items-center'>
                          <Image src={specificPost.userPhoto} className='rounded-full' preview={false} width={60}/>
                          <div className='flex flex-col items-start mx-3'>
                            <h1 className='text-dim-white font-semibold'>{specificPost.userName}</h1>
                            <p className='italic text-xs font-bold'>@harisak</p>
                            <p className='text-xs text-dim-white my-2 font-semibold'>{specificPost.description}</p>
                          </div>
                        </div>
                        <div className=''>
                          {(specificPost.post_useruid === user.uid) === true && <div>
                            <button className='relative' onClick={settingShow}>
                            <Avatar icon={<BarsOutlined/>} className='bg-secondary'/>
                          </button>
                          <div className={showSetting ? 'absolute z-10 w-1/2' : 'hidden'} >
                            <div className='bg-main flex flex-col bg-secondary w-1/6 justify-center p-3 rounded-lg'>
                              <button className='flex items-end my-2' onClick={()=> handleDelete(specificPost.Id)}>
                                <Avatar className='bg-secondary' size={'small'} icon={<DeleteOutlined/>}/>
                                <h1 className='text-xs font-medium '>Delete</h1>
                              </button>
                              <button className='flex items-end my-2 ' onClick={()=> handleEdit(specificPost.Id)}>
                                <Avatar className='bg-secondary' size={'small'} icon={<EditOutlined/>} />
                                <h1 className='text-xs font-medium '>Edit</h1>
                              </button>
                            </div>
                          </div>
                          </div>}
                          </div>
                      </div>
                        <div className=' flex-col flex overflow-y-scroll h-26'>
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
                              <input type="text" name="comment" onChange={(e)=> setComment(e.target.value)} id="comment" className='w-9/12 appearance-none border-b-2 bg-transparent border-dim-white placeholder:italic pl-2 focus:outline-0 hover:outline-0' placeholder='your comment...'/>
                              <button type='submit' onClick={handleComment} className=' m-auto rounded w-1/6 pb-1'><RightOutlined /></button>
                              </div>
                        </div>  
                    </div>
                  <div className='w-3/5 flex'>
                    <Image src={specificPost.post_image} className='rounded-xl '/>
                  </div> 
                  </section>
              </div>
              
              <div className={editModal ? `border-2 border-secondary opacity-100 bg-main p-10 rounded-md my-2 w-1/2 absolute left-96 top-80`: 'hidden'}>
                  <div className='flex justify-between mb-10' onClick={()=>{setmodal(false); setSetting(false)}}>
                  <h1 className='text-dim-white text-xl'>Edit Description</h1>
                  <Avatar icon={<CloseOutlined />} className='bg-main'/>
                  </div>
                  <div className='flex items-end'>
                    <input type="text" onChange={(e)=> setEditText(e.target.value)} className='bg-transparent border-b-2 w-11/12 border-dimest placeholder:font-bold placeholder:text-xs placeholder:italic outline-0' placeholder={specificPost.description}/>
                    <button onClick={()=> handleEditText(specificPost.Id)}>
                      <Avatar icon={<CheckOutlined />} className='bg-main mx-3'/>
                    </button>
                  </div>
                </div>
      </section>
    </main>
  )
}

export default Comments