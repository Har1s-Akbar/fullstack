import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, where, query, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore/lite'
import { db } from '../auth/firebaseConfig'
import Nav from './Nav'
import { Avatar, Image } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProfileSingle() {
  const {id} = useParams()
  const [profilePosts, setprofilePosts] = useState([])
  const user = useSelector((state)=> state.reducer.copyUserdata)
  const [profile, setprofile] = useState([])
  const [follower, setFollower] = useState([]);
  const [isFollower, setIsFollower] = useState(false)
  const handleProfile = async() => {
    getDoc(doc(db, "usersProfile", id)).then((item)=> {setprofile(item.data())})
  }
  const handlePosts = async() =>{
    const queryRef = collection(db, 'users')
    const queryPosts = query(queryRef, where("post_useruid", "==", id))
    const queryData = await getDocs(queryPosts)
    const data = queryData.docs.map((item)=> {return item.data()})
    setprofilePosts(data)
    // const profilePosts = 
  }
  const handleFollowerSingle = async(uid)=>{
    const followerRef = doc(db, 'usersProfile', uid)
    getDoc(followerRef).then((item)=> {  
        const data = item.data()
        const followersArray = data.followers
          const followersData = data.followersData 
          if(followersArray.includes(user.uid)){
            setIsFollower(false)
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
            setIsFollower(false)
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
  useEffect(()=> handleProfile, [])
  useEffect(()=> handlePosts, [])
  return (
    <section className='flex'>
    <div className='w-1/5'>
      <Nav/>
    </div>
    <div className='flex w-full flex-col items-center my-5'>
        <div className='flex'>
            <div className='flex flex-col items-center justify-center mx-10'>
            <Avatar src={profile?.photo} size={'large'} className='border-2 border-yelow-300'/>
            <h1 className='text-2xl '>{profile?.name}</h1>
            </div>
          <div className='flex'>
            <div>
              <button className='border-2 px-3 py-1 rounded font-semibold text-white bg-black opacity-60 '><div>
              <h1>Followers</h1>
              <p>0</p>
              </div>
              </button>
            </div>
            <div>
              <button className='border-2 px-3 py-1 rounded font-semibold text-white bg-black opacity-60 '><div>
              <h1>Following</h1>
              <p>0</p>
              </div>
              </button>
            </div>
          </div>
        </div>
      <div className='my-10 '>
        <h1>
          "Man Child in the promised NeverLand"
        </h1>
      </div>
      <div className='w-1/2'>
        <button className='border-2 rounded w-full py-2 bg-black text-white font-semibold' onClick={()=> handleFollowerSingle(profile.uid)}>
          Follow
        </button>
      </div>
      <div className='my-10 flex w-11/12 flex-col items-center justify-center'>
        {
          isFollower ? <div className='grid grid-cols-3 w-3/4 border-2 rounded grid-rows-4'>
        <div>
          <h1 className='text-5xl my-5 font-mono'>Your Posts</h1>
        </div>
          {profilePosts.map((item)=> {
            return <Link className='group' to={`/posts/comments/${item.Id}`}>
            <Image src={item.post_image} className='rounded ease-linear relative delay-75 duration-100 transition hover:brightness-50' preview={false}/>
            </Link>
          })}
        </div> : <div>
          Follow to see More...
        </div>
        }
      </div>
    </div>
  </section>
  )
}

export default ProfileSingle