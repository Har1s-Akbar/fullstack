import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { query,collection, getDocs, where, setDoc, doc, getDoc} from 'firebase/firestore/lite';
import Nav from './Nav'
import { db, storage } from '../auth/firebaseConfig';
import { Avatar, Image, Dropdown } from 'antd';
import { v4 } from 'uuid';
import { setcopyData } from '../store/slice';
import { Link, useParams } from 'react-router-dom';
import { PlusOutlined, BarsOutlined } from '@ant-design/icons';

function Profile() {
  // const {id} = useParams()
  // console.log(id)
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
          })
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
      const data = querySnapshot.docs.map((item)=> {return item.data()})
      setPosts(data)
    }
    useEffect(()=> getPosts, [user])
    useEffect(()=> getUser, [])
    // const unique = [...new Map(posts.map(item => [item['post_image'], item])).values()]
    return (
    <section className='flex bg-main text-dim-white min-h-screen'>
    <div className=''>
      <Nav/>
    </div>
    <div className='flex flex-col'>
      <div className='bg-secondary my-10 w-1/2 h-1/2 flex items-end rounded-xl m-auto'>
          <Image src={CopyUser.photo} preview={false} fallback='https://rb.gy/tebns' className='rounded-full w-1/2 opacity-80 border-2 border-dim-white my-5 ml-5' width={55}/>
          <PlusOutlined className='mb-6'/>
      </div>
      <div className=' flex flex-col items-start'>
        {posts.map((item)=> {
          return <Link to={`/comments/${item.Id}`} className='bg-secondary w-2/3 ml-14 rounded-xl flex my-5 justify-between'>
            <div className='w-1/2'>
              <div className='w-full flex items-satrt justify-between mt-3 border-b-2 pb-5 border-dimest'>
                <div className='flex ml-3 items-center'>
                  <Image src={item.userPhoto} className='rounded-full' preview={false} width={60}/>
                  <div className='flex flex-col items-start mx-3'>
                    <h1 className='text-dim-white font-semibold'>{item.userName}</h1>
                    <p className='italic text-xs font-bold'>@harisak</p>
                    <p className='text-xs text-dim-white my-2 font-semibold'>{item.description}</p>
                  </div>
                </div>
                <div className='mr-5'>
                  <Avatar icon={<BarsOutlined />} className='bg-secondary'/>
                </div>
              </div>
              <div className='w-full'>
                {item.comments.map((cmnt)=> {
                  return <div className='my-2 ml-3 flex items-center'>
                    <Avatar src={cmnt.commentPhoto} size={'small'}/>
                    <p className='text-xs font-bold text-dim-white mx-2'>{cmnt.commnetProfile} :</p>
                    <p className='text-xs font-medium opacity-80 text-dim-white'>{cmnt.comment}</p>
                  </div>
                })}
              </div>
            </div>
          <div className='w-3/5 flex'>
            <Image src={item.post_image} className='rounded-xl '/>
          </div> 
          </Link>
        })}
      </div>
    </div>
  </section>

  )
}

export default Profile