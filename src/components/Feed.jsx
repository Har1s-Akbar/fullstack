import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { query,collection, getDocs, where, setDoc, doc, getDoc, updateDoc, arrayRemove, arrayUnion, serverTimestamp} from 'firebase/firestore/lite';
import Nav from './Nav'
import { db, storage } from '../auth/firebaseConfig';
import { Avatar, Image, Skeleton } from 'antd';
import { v4 } from 'uuid';
import { setcopyData } from '../store/slice';
import { setPosts } from '../store/postSlice';
import { Link, useParams } from 'react-router-dom';
import { PlusOutlined, LikeOutlined, MessageOutlined , SendOutlined, BookOutlined, UserAddOutlined} from '@ant-design/icons';


function Profile() {
  const user = useSelector((state)=> state.reducer.userdata);
  const CopyUser = useSelector((state)=> state.reducer.copyUserdata)
  const dispatch = useDispatch()
  const [Loading, setloading] = useState(true)
  const [posts, setposts] = useState([])
  const [ render, setRender] = useState(false)
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
              description: '',
              photo: user.photoURL,
              follwers: [],
              following:[],
              isanonymous : user.isAnonymous,
              Isverified: user.emailVerified,
              time: serverTimestamp(),
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
      // const likedPost = query(queryRef, where("post_useruid", "==", user.uid))
      const querySnapshot = await getDocs(queryRef);
      const data = querySnapshot.docs.map((item)=> {return item.data()})
      setposts(data)
      dispatch(setPosts(data))
      setloading(false)
    }
    const handleLikes = async(Id) => {
      setRender(true)
      const idDocument = Id
      const specificRef = doc(db, "users", Id)
      getDoc(specificRef).then((resp)=> {
      const data = resp.data()
      const likesArray = data.likes
      const updateRef = doc(db, "users", idDocument)
          if(likesArray.includes(user.uid)){
              updateDoc(updateRef,{
                  likes: arrayRemove(user.uid)
              })
              setRender(false)
          }
          else{
              updateDoc( updateRef,{
                  likes: arrayUnion(user.uid)
              })
              setRender(false)
          }

      })
  }
  const followerExist = () =>{
  }
    useEffect(()=> getPosts, [user, render])
    useEffect(()=> getUser, [])
    // const unique = [...new Map(posts.map(item => [item['post_image'], item])).values()]
    return (
    <section className='flex bg-main text-dim-white min-h-screen'>
    <div className=''>
      <Nav/>
    </div>
    {/* {
      Loading ? <div>Loading the posts.....</div> : */}
      <div className='flex flex-col'>
      <Skeleton loading={Loading} paragraph={{rows:0}}>
          <Link to={`/profile/${user.uid}`} className='bg-secondary my-10 w-1/2 flex items-end rounded-xl m-auto'>
            <Image src={CopyUser.photo} preview={false} fallback='https://rb.gy/tebns' className='rounded-full w-1/2 opacity-80 border-2 border-dim-white my-5 ml-5' width={55}/>
            <PlusOutlined className='mb-4'/>
          </Link>
      </Skeleton>
      <div className='px-2 ml-10 w-1/2'>
        {
          posts.map((item)=> {
            return <section className='my-10'>
              <div className='w-full my-5 bg-secondary pt-5 pb-5 px-5 rounded-xl'>
              <div className='flex items-center w-full'>
                <Skeleton paragraph={{rows:1}} loading={Loading} avatar>
                  <Link to={`/profile/${item.post_useruid}`} className='flex items-center w-full'>
                    <Image src={item.userPhoto} width={60} className='rounded-full'/>
                    <div className='flex items-start flex-col ml-3'>
                      <h1 className='text-xl text-dim-white font-medium'>{item.userName}</h1>
                      <p className='text-xs text-sim-white font-bold italic opacity-90'>@harisak</p>
                    </div>
                  </Link>
                  {/* <div>
                      <Avatar icon={<UserAddOutlined />} size={'large'} className='bg-secondary'/>
                  </div> */}
                </Skeleton>
              </div>
              <Skeleton paragraph={{rows:0}} className='my-4' loading={Loading}>
                <h1 className='text-xl my-3 ml-2 text-dim-white font-semibold'>{item.description}</h1>
              </Skeleton>
              <div className='mt-2'>
                  <Image src={item.post_image} className='rounded-md'/>
              </div>
            </div>
              <div className='bg-secondary rounded-xl w-full py-5 '>
                  <div className='flex items-center w-11/12 m-auto justify-between'>
                    <button onClick={()=> handleLikes(item.Id)} className='flex items-end'>
                      <h1 className='mx-2 text-xl font-thin text-dim-white'>{item.likes.length}</h1>
                      <Avatar icon={<LikeOutlined />} className='bg-secondary' style={{fontSize: '150%'}} size={'large'}/>
                    </button>
                    <button>
                      <Link to={`/comments/${item.Id}`}>
                        <Avatar icon={<MessageOutlined />} className='bg-secondary'style={{fontSize: '150%'}} size={'large'}/>
                      </Link>
                    </button>
                    <button>
                      <Avatar icon={<SendOutlined />} className='bg-secondary -rotate-45'style={{fontSize: '150%'}} size={'large'}/>
                    </button>
                    <button>
                      <Avatar icon={<BookOutlined />} className='bg-secondary'style={{fontSize: '150%'}} size={'large'}/>
                    </button>
                  </div>
              </div>
            </section>
          })
        }
        </div>
    </div>
    {/* } */}
  </section>

  )
}

export default Profile