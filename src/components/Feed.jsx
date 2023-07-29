import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { query,collection, getDocs, where, setDoc, doc, getDoc, updateDoc, arrayRemove, arrayUnion, serverTimestamp, deleteDoc, addDoc, limit, orderBy} from 'firebase/firestore/lite';
import Nav from './Nav'
import { db, storage } from '../auth/firebaseConfig';
import { Avatar, Image, Skeleton, message } from 'antd';
import { v4 } from 'uuid';
import { setcopyData } from '../store/slice';
import { setPosts } from '../store/postSlice';
import { Link, useParams } from 'react-router-dom';
import { PlusOutlined, LikeOutlined, MessageOutlined , SendOutlined, BookOutlined, UserAddOutlined} from '@ant-design/icons';
import Create from './Create';


function Profile() {
  const user = useSelector((state)=> state.reducer.userdata);
  const CopyUser = useSelector((state)=> state.reducer.copyUserdata)
  const dispatch = useDispatch()
  const [Loading, setloading] = useState(true)
  const [posts, setposts] = useState([])
  const [ render, setRender] = useState(false)
  //  states for getting saved posts
  const [saved, setSaved] = useState([])
  const [uniqueSaved, setuniqueSaved] = useState([])
  const [suggestionUser, setsuggestionUser] = useState([])
  // for setting Initial user
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
              username: '',
              uid: user.uid,
              description: '',
              photo: user.photoURL,
              followers: [],
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
// End setting initial User

// start of getting all posts from the users collection firebase
  const getPosts = async() => {
    const queryRef = collection(db, 'users');
      const likedPost = query(queryRef, orderBy('time'))
      const querySnapshot = await getDocs(likedPost);
      const data = querySnapshot.docs.map((item)=> {return item.data()})
      setposts(data)
      dispatch(setPosts(data))
      setloading(false)
    }
  // end of getting posts
  
  // start of handleing the likes on posts Logic
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
  // end of handeling likes on posts

  // start of the saving post Logic
  const savePost = async(id) => {
    event.preventDefault();
    const documentRef = doc(db, 'users', id)
    const getSave = await getDoc(doc(db, 'saved', id))
    
    if(getSave.exists() === true){
      const remove = deleteDoc(doc(db, 'saved' , id)).then(()=> {message.info('Post Unsaved Successfully')})
      getSavedPosts
    }else{
      const postSave = setDoc(doc(db, 'saved', id),{
        savedby: user.uid,
        postId : id,
        savedAt: serverTimestamp(),
        ref: documentRef,
      }).then(()=> {message.success('Post Saved successfully')
    })
    getSavedPosts
    }
  }
  // end of saving posts Logic

  // start of getting the saved Posts from firebase
  const getSavedPosts = async() => {
    const queryRef = collection(db, 'saved')
    const savedQuery = query(queryRef, where('savedby', '==', user.uid), orderBy('savedAt') ,limit(2))
    const getPosts = await getDocs(savedQuery)
    const Data =  getPosts.docs.map(async(items)=> {
        if(items.exists()){
            const data = items.data()
            const getSaved = await getDoc(data.ref)
            const savedData = getSaved.data()
            setSaved((prev)=> [...prev, savedData])
        }else{
            return []
        }
    })
}
// end of saved posts Logic
const getSuggestions = async() => {
  const fetchDocs = await getDocs(collection(db, 'usersProfile'))
  const Data = fetchDocs.docs.map((item)=> {return item.data()})
  setsuggestionUser(Data)
}


    useEffect(()=> getPosts, [user, render])
    useEffect(()=> getUser , [])
    // useEffect(()=> getSuggestions , [])
    useEffect(()=> getSavedPosts, [user, render])
    useEffect(()=> {
      const unique = [...new Map(saved.map(item => [item['Id'], item])).values()]
      setuniqueSaved(unique)
    },[saved])
  // console.log(suggestionUser)
    return (
    <section className={posts.length === 0 ? 'grid grid-cols-5 justify-items-center flex min-h-screen bg-main': 'flex min-h-screen bg-main text-dim-white'}>
    <div className=''>
      <Nav/>
    </div>
    {/* {
      Loading ? <div>Loading the posts.....</div> : */}
    <div className={posts.length === 0? 'w-7/12 col-start-2 col-end-6 flex flex-col items-center justify-center': "flex flex-col"}>
      <Skeleton loading={Loading} paragraph={{rows:0}}>
          <Link to={`/profile/${user.uid}`} className={posts.length === 0? 'bg-secondary my-10 w-full flex items-end rounded-xl': 'bg-secondary my-10 w-1/2 flex items-end rounded-xl m-auto'}>
            <Image src={CopyUser.photo} preview={false} fallback='https://rb.gy/tebns' className='rounded-full w-1/2 opacity-80 border-2 border-dim-white my-5 ml-5' width={55}/>
            <PlusOutlined className='mb-4'/>
          </Link>
      </Skeleton>
      <div className='flex justify-between w-11/12'>
        <div className='px-2 ml-10 w-7/12'>
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
                      <button onClick={()=> {savePost(item.Id)}}>
                        <Avatar icon={<BookOutlined />} className='bg-secondary'style={{fontSize: '150%'}} size={'large'}/>
                      </button>
                    </div>
                </div>
              </section>
            })
          }
          </div>
          <section className=' flex flex-col sticky top-0 h-1/4 w-1/4'>
          <div className={posts.length === 0 ? 'hidden':'my-10 w-11/12'}>
              <Create/>
            </div>
            <span className='w-full border border-dim-white opacity-70'></span>
              <div className={uniqueSaved.length === 0 ? ' border-b hidden border-dim-white ' : ' my-5'}>
                <div className=' mb-5'>
                  <h1 className='text-2xl font-semibold text-dim-white'>Saved Posts</h1>
                </div>
                <div className='items-center rounded-xl gap-1 place-content-center grid grid-cols-2 w-full'>
                  {uniqueSaved.map((item)=> {
                    return <div>
                      <Image className='rounded-xl' preview={false} src={item.post_image}/>
                    </div>
                  })}
                  <div className={uniqueSaved.length === 0 ? 'flex flex-col items-center justify-center col-span-2': 'flex flex-col items-center col-span-2 justify-center'}>
                    <h1 className={uniqueSaved.length === 0 ? 'text-dim-white text-2xl opacity-50 font-thin my-1': 'text-dim-white text-base font-semibold my-1'}>{
                      uniqueSaved.length === 0 ? 'Save some posts' : 'See All Saved Posts' 
                    }</h1>
                    <button className={uniqueSaved.length === 0 ? 'hidden': 'w-9/12 bg-secondary rounded-lg py-2 my-1 opacity-60 hover:opacity-100 transition delay-200 ease-in-out'}>
                      <Link to={`/profile/${user.uid}`}>
                        Visit
                      </Link>
                    </button>
                  </div>
                  </div>
              </div>
          </section>
      </div>
      </div>
    {/* } */}
  </section>

  )
}

export default Profile