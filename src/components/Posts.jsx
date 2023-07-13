import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { getDocs, collection } from 'firebase/firestore/lite'
import { db} from '../auth/firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../store/postSlice'
import { Avatar, Image, Button, Space } from 'antd'
import { LikeOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons'

function Posts() {
    const dataRef = collection(db,"users");
    const dispatch = useDispatch()
    const Allposts = useSelector((state)=> state.reducerPost.userPosts)
    const getData = () => {
        getDocs(dataRef).then((resp)=>{
            const data = resp.docs.map((item)=> {return item.data()})
            dispatch(setPosts(data))
        })
    }
    useEffect(()=> getData, [])
    console.log(Allposts) 
  return (
    <section className='flex'>
        <div className='w-1/5'>
            <Nav/>
        </div>
        <div className='w-full'>
            {Allposts.map((item, index)=> {
                return <div className='mt-10 flex flex-col items-center'>
                    <div key={index}>
                        <div className='flex items-center' key={index}>
                            <Avatar src={item.userPhoto} size={'large'} className='border-2 border-orange-300' alt={item.userName}/>
                            <h1 className='font-mono mx-2 font-thin'>{item.userName}</h1>
                        </div>
                        <div>
                            <h1 className='font-medium text-xl my-3 border-l-2 border-black pl-2'>{item.description}</h1>
                            <Image src={item.post_image} className='rounded drop-shadow-xl border-2 border-yellow-200' width={700} alt={item.userName} fallback='https://shorturl.at/IKMT0'/>  
                        </div>
                    </div>
                    <div className='flex'>
                        <button className='px-28 border-2 py-2 rounded flex jutsify-center items-center'>
                            <div className='flex items-center '>
                                <h1 className='mx-2'>{item.likes.length}</h1>
                                <LikeOutlined style={{fontSize:'20px'}}/>
                            </div>
                        </button>
                        <button className='px-28 border-2 py-2 rounded flex jutsify-center items-center'>
                            <CommentOutlined style={{fontSize:'20px'}}/>
                        </button>
                        <button className='px-28 border-2 py-2 rounded flex jutsify-center items-center'>
                            <ShareAltOutlined style={{fontSize:'20px'}}/>
                        </button>
                    </div>
                </div>
            })}
        </div>
    </section>
  )
}

export default Posts