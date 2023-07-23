import React, { useEffect, useState } from 'react'
import { db } from '../auth/firebaseConfig'
import { collection, getDocs, query, where, getDoc } from 'firebase/firestore/lite'
import { useSelector } from 'react-redux'
import { Image } from 'antd'
import { set, uniq } from 'lodash'

function SavedPosts() {
    const [savedPosts, setsavedPosts] = useState([])
    const [uniqsavedPosts, setuniquesavedPosts] = useState([])
    const user = useSelector((state)=> state.reducer.copyUserdata)
    const [loading,setLoading] = useState(true)
    const getSavedPosts = async() => {
        const queryRef = collection(db, 'saved')
        const savedQuery = query(queryRef, where('savedby', '==', user.uid))
        const getPosts = await getDocs(savedQuery)
        const Data =  getPosts.docs.map(async(items)=> {
            const data = items.data()
            if(items.exists()){
                    const singleData = await getDoc(data.ref)
                    const finalData = singleData.data()
                    setsavedPosts((prev)=> [...prev, finalData])
                }else{
                    setsavedPosts([])
                }
            })
            // console.log(data.map((item)=> {return item.ref}))
        }
    useEffect(()=> getSavedPosts, [loading])
  return (
    <section className='bg-secondary'>
        <div className='text-center'>
            <h1 className='text-2xl'>Saved Posts</h1>
        </div>
        <div>
            {/* {savedPosts.map((item)=> {
                return <div>
                    <Image src={item.}/>      
                </div>
            })} */}
        </div>
    </section>
  )
}

export default SavedPosts