import React, { useEffect } from 'react'
import Nav from './Nav'
import { getDocs, collection } from 'firebase/firestore/lite'
import { db,storage } from '../auth/firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../store/postSlice'
import { Image } from 'antd'

function Posts() {
    const dataRef = collection(db,"users")
    const dispatch = useDispatch()
    const Allposts = useSelector((state)=> state.reducerPost.userPosts)
    console.log(Allposts)
    const getData = () => {
        getDocs(dataRef).then((resp)=>{
            const data = resp.docs.map((item)=> {return item.data()})
            dispatch(setPosts(data))
        })
    }
    useEffect(()=> getData, [])
  return (
    <section className='grid grid-cols-2'>
        <div className='w-1/2'>
            <Nav/>
        </div>
        <div>
        </div>
    </section>
  )
}

export default Posts