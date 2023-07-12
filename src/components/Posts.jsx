import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { getDocs, collection } from 'firebase/firestore/lite'
import { ref, listAll,getDownloadURL, getMetadata } from 'firebase/storage'
import { db,storage } from '../auth/firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../store/postSlice'
import { Avatar } from 'antd'

function Posts() {
    const dataRef = collection(db,"users");
    const listRef = ref(storage, '/image');
    const [metaData, setMetaData] = useState([])
    const [imageUrl, setImageUrl] = useState([])
    useEffect(()=> imagefetch, [])
    const dispatch = useDispatch()
    const Allposts = useSelector((state)=> state.reducerPost.userPosts)
    const getData = () => {
        getDocs(dataRef).then((resp)=>{
            const data = resp.docs.map((item)=> {return item.data()})
            dispatch(setPosts(data))
        })
    }
    useEffect(()=> getData, [])
    const imagefetch = async() => {
        const firstPage = await listAll(listRef).then((response)=> 
            response.items.forEach((item)=> 
            getDownloadURL(item).then((url)=>
            {setImageUrl((prev)=> 
                [...prev, url])})))
    }
    const imageMetadata = async()=> {
         const fetchData = await listAll(listRef).then((resp)=> 
            resp.items.forEach((item)=> 
            getMetadata(item).then((data)=> 
                {setMetaData((prev)=> [...prev, data.customMetadata])})))
    }
    useEffect(()=> imageMetadata, [])
    
    // const fullPost = Allposts.filter((item)=>item.key === metaData.map((item)=> item.key)
  return (
    <section className='flex'>
        <div className='w-1/2'>
            <Nav/>
        </div>
        <div className='w-full'>
            {Allposts.map((item)=> {
                return <div className=''>
                    <div className='flex'>
                        <Avatar src={item.userPhoto} size={'large'} className='border-2 border-orange-300' alt={item.userName}/>
                        <h1 className='font-mono mx-2 font-thin'>{item.userName}</h1>
                    </div>
                    <div>
                        <h1 className='font-medium my-5'>{item.description}</h1>
                    </div>
                </div>
            })}
        </div>
    </section>
  )
}

export default Posts