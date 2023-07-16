import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { query,collection, getDocs, where, setDoc, doc, getDoc} from 'firebase/firestore/lite';
import Nav from './Nav'
import { db } from '../auth/firebaseConfig';
import { Avatar, Image } from 'antd';
import { v4 } from 'uuid';
import { setcopyData } from '../store/slice';
import { Link } from 'react-router-dom';

function Profile() {
  const user = useSelector((state)=> state.reducer.userdata);
  const CopyUser = useSelector((state)=> state.reducer.copyUserdata)
  const dispatch = useDispatch()
  const [posts, setPosts] = useState([])
  const getUser = async() => {
    const queryRef = collection(db, 'usersProfile');
      const userQuery = query(queryRef, where("uid", "==", user.uid))
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((docs)=> {
        if(!docs.exists()){
          const unique = v4()
          setDoc(doc(db, "usersProfile", user.uid),{
            Id: unique,
            name: user.displayName,
            email:user.email,
            uid: user.uid,
            photo: user.photoURL,
            isanonymous : user.isAnonymous,
            Isverified: user.Isverified
          })
        }else{
          const data = docs.data()
          dispatch(setcopyData(data))
          console.log(CopyUser)
        }
      })
  }
  const getPosts = async() => {
    const queryRef = collection(db, 'users');
      const likedPost = query(queryRef, where("post_useruid", "==", CopyUser.uid))
      const querySnapshot = await getDocs(likedPost);
      querySnapshot.forEach((docs)=> {
        setPosts((prev)=> [...prev, docs.data()]);
      })
    }
    useEffect(()=> getPosts, [])
    useEffect(()=> getUser, [])
    
    const unique = [...new Map(posts.map(item => [item['post_image'], item])).values()]
      
  return (
    <section className='flex'>
      <div className='w-1/5'>
        <Nav/>
      </div>
      <div className='flex w-full flex-col justify-center items-center my-5'>
        <div className='flex items-center justify-center rounded border-2 w-1/2 mb-1'>
          <input type="file" id='file'className='hidden'/>
          <label htmlFor="file" className='py-20 rounded py-2 px-2 cursor'><span className='font-bold text-2xl'>+</span> A Cover Photo</label>
        </div>
          <Avatar src={CopyUser.photo} size={'large'}/>
          <h1 className='text-2xl '>{CopyUser.name}</h1>
        <div className='my-2'>
          <h1>
            "Man Child in the promised NeverLand"
          </h1>
        </div>
        {/* <div>
          <button className='border-2 px-3 py-1 rounded font-semibold text-white bg-black opacity-60 '>Follow</button>
        </div> */}
        <div className='my-20 flex w-11/12 flex-col items-center justify-center'>
          <div>
            <h1 className='text-4xl my-5'>Posts</h1>
          </div>
          <div className='grid grid-cols-3 w-3/4 border-2 rounded grid-rows-4'>
            {unique.map((item)=> {
              return <Link to={`/posts/comments/${item.Id}`}>
              <Image src={item.post_image} className='rounded ease-linear delay-75 duration-100 transition hover:brightness-50' preview={false}/>
              </Link>
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile