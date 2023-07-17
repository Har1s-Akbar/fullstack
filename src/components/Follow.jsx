import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { collection, getDocs, arrayRemove, doc,arrayUnion, getDoc, updateDoc } from 'firebase/firestore/lite'
import { db } from '../auth/firebaseConfig'
import { Avatar } from 'antd'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Follow() {
    const [followUsers, setfollowusers] = useState([]);
    const user = useSelector((state)=> state.reducer.copyUserdata)
    const getUsers = async() => {
        const usersRef = collection(db, "usersProfile")
        getDocs(usersRef).then((users)=> {
           const data = users.docs.map((users)=> {return users.data()})
           setfollowusers(data)
        })
    }
    const handleFollowerSingle = async(uid)=>{
        const followerRef = doc(db, 'usersProfile', uid)
        getDoc(followerRef).then((item)=> {  
            const data = item.data()
            const followersArray = data.followers
              const followersData = data.followersData 
              if(followersArray.includes(user.uid)){
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
    const filterArray = followUsers.filter((item)=> item.uid !== user.uid)
    console.log(filterArray)
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
                    filterArray.map((items, index)=> {
                        return <Link to={`/profile/${items.uid}`}>
                            <div className='flex justify-between my-5 border-2 bg-red-100 py-2 rounded px-2'>
                            <div className='flex items-center'>
                                <Avatar size={'large'} src={items.photo} />
                                <h1 className='mx-2 font-semibold'>{items.name}</h1>
                            </div>
                        </div>
                        </Link>
                    })
                }
            </div>
        </div>
    </section>
  )
}

export default Follow