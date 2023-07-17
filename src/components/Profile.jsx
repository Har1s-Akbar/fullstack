import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { query,collection, getDocs, where, setDoc, doc, getDoc} from 'firebase/firestore/lite';
import Nav from './Nav'
import { db, storage } from '../auth/firebaseConfig';
import { Avatar, Image, Dropdown } from 'antd';
import { v4 } from 'uuid';
import { setcopyData } from '../store/slice';
import { Link, useParams } from 'react-router-dom';

function Profile() {
  const {id} = useParams()
  console.log(id)
  const user = useSelector((state)=> state.reducer.userdata);
  const CopyUser = useSelector((state)=> state.reducer.copyUserdata)
  const dispatch = useDispatch()
  const [posts, setPosts] = useState([])
  const getUser = async() => {
    const queryRef = collection(db, 'usersProfile');
      const userQuery = query(queryRef, where("uid", "==", user.uid))
      const querySnapshot = await getDocs(userQuery);
      if(querySnapshot.empty){
          const unique = v4()
          setDoc(doc(db, "usersProfile", user.uid),{
              Id: unique,
              name: user.displayName,
              email:user.email,
            uid: user.uid,
            photo: user.photoURL,
            isanonymous : user.isAnonymous,
            Isverified: user.emailVerified
          }).then((data)=> console.log(data)).catch((error)=> console.log(error))
        }
        else{
        querySnapshot.forEach((docs)=> {
          const data = docs.data()
          dispatch(setcopyData(data))
        })
        }
  }
  const getPosts = async() => {
    const queryRef = collection(db, 'users');
      const likedPost = query(queryRef, where("post_useruid", "==", user.uid))
      const querySnapshot = await getDocs(likedPost);
      querySnapshot.forEach((docs)=> {
        setPosts((prev)=> [...prev, docs.data()]);
      })
    }
    useEffect(()=> getPosts, [user])
    useEffect(()=> getUser, [])
    const unique = [...new Map(posts.map(item => [item['post_image'], item])).values()]
  return (
    // CopyUser ? 
    <section className='flex'>
    <div className='w-1/5'>
      <Nav/>
    </div>
    <div className='flex w-full flex-col items-center my-5'>
        <Avatar src={CopyUser?.photo} size={'large'}/>
        <h1 className='text-2xl '>{CopyUser?.name}</h1>
        
      <div className='my-2'>
        <h1>
          "Man Child in the promised NeverLand"
        </h1>
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
      <div className='my-10 flex w-11/12 flex-col items-center justify-center'>
        <div>
          <h1 className='text-5xl my-5 font-mono'>Your Posts</h1>
        </div>
        <div className='grid grid-cols-3 w-3/4 border-2 rounded grid-rows-4'>
          {unique.map((item)=> {
            return <Link className='group' to={`/posts/comments/${item.Id}`}>
            <Image src={item.post_image} className='rounded ease-linear relative delay-75 duration-100 transition hover:brightness-50' preview={false}/>
            </Link>
          })}
        </div>
      </div>
    </div>
  </section>

  )
}

export default Profile