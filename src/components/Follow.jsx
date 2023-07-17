import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { collection, getDocs, arrayRemove, doc,arrayUnion, getDoc, updateDoc } from 'firebase/firestore/lite'
import { db } from '../auth/firebaseConfig'
import { Avatar } from 'antd'
import { useSelector } from 'react-redux'

function Follow() {
    const [followUsers, setfollowusers] = useState([])
    const [remove, setRemove] = useState(false)
    const user = useSelector((state)=> state.reducer.copyUserdata)
    const getUsers = async() => {
        const usersRef = collection(db, "usersProfile")
        getDocs(usersRef).then((users)=> {
           const data = users.docs.map((users)=> {return users.data()})
           setfollowusers(data)
        })
    }
    const handleFollower = async(uid)=>{
        setRemove(false)
        const followerRef = doc(db, 'usersProfile', uid)
        getDoc(followerRef).then((item)=> {  
            const data = item.data()
            const followersArray = data.followers
              const followersData = data.followersData 
              console.log(followersArray)
              if(followersArray.includes(user.uid)){
                setRemove(false)
                updateDoc(followerRef,{
                    followers: arrayRemove(user.uid),
                    followersData: arrayRemove({
                        Id: user.uid,
                        name: user.name,
                        photo: user.photo,
                        email:user.email
                    })
                })
              }else{
                setRemove(true)
                updateDoc(followerRef,{
                    followers: arrayUnion(user.uid),
                    followersData: arrayUnion({
                        Id: user.uid,
                        name: user.name,
                        photo: user.photo,
                        email:user.email
                    })
                })
              }
        })
    } 
    useEffect(()=> getUsers, [])
    console.log(followUsers)
  return (
    <section className='flex items-center'>
        <div className='w-1/5'>
            <Nav/>
        </div>
        <div className='w-1/2 m-auto'>
            <div>
                <h1 className='text-5xl text-center my-5 font-mono'>
                    Follow People
                </h1>
            </div>
            <div className=''>
                {
                    followUsers.map((items)=> {
                        return <div className='flex justify-between my-5 border-2 bg-red-100 py-2 rounded px-2'>
                            <div className='flex items-center'>
                                <Avatar size={'large'} src={items.photo} />
                                <h1 className='mx-2 font-semibold'>{items.name}</h1>
                            </div>
                            <div>
                                <button className='border-2 px-2 py-1 rounded bg-black text-white font-semibold opacity-80 after:bg-blue' onClick={()=> handleFollower(items.uid)}>Follow</button>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    </section>
  )
}

export default Follow