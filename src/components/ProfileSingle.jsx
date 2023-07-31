import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, where, query, updateDoc, arrayRemove, arrayUnion, orderBy, limit } from 'firebase/firestore/lite'
import { db } from '../auth/firebaseConfig'
import Nav from './Nav'
import { Avatar, Image, Tooltip, Modal, message } from 'antd'
import { PlusOutlined, TableOutlined, TabletOutlined,CloseOutlined, RightOutlined, TabletFilled} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import ProfilePicture from './ProfilePicture'

const variant ={
  open: { opacity : 1, y : 0, sizeX: '100%'},
  closed:{ opacity:0, y: '-100%'},
}

function ProfileSingle() {
  const {id} = useParams()
  const [saved, setSaved] = useState([]);
  const [showPosts, setshowPosts] = useState(true)
  const [showSaved, setshowSaved] = useState(false)
  const [uniqueSaved, setuniqueSaved] = useState([])
  const navigate = useNavigate()
  const [profilePosts, setprofilePosts] = useState([])
  const [Name, setName] = useState('')
  const [showDescp, setDescp] = useState(false)
  const [nameBtn, setnameBtn] = useState(false)
  const[inputDisable, setDisable] = useState(true);
  const [followerReload, setReload] = useState(false)
  const [Loading, setloading] = useState(false)
  const [descp, setDescpText] = useState('')
  const user = useSelector((state)=> state.reducer.copyUserdata)
  const [profile, setprofile] = useState([]);
  
  const handlePosts = async() =>{
    const queryRef = collection(db, 'users')
    const queryPosts = query(queryRef, where("post_useruid", "==", id))
    const queryData = await getDocs(queryPosts)
    const data = queryData.docs.map((item)=> {return item.data()})
    setprofilePosts(data)
  }
  const getProfile = async() => {
    const profileRef = doc(db, 'usersProfile', id)
    const Data = await getDoc(profileRef)
    const data = Data.data()
    setprofile(data)
    setloading(true)
  }
  const handleFollowerSingle = async(uid)=>{
    const followerRef = doc(db, 'usersProfile', uid)
    getDoc(followerRef).then((item)=> {  
        const data = item.data()
        const followersArray = data.followers
          if(followersArray.includes(user.uid)){
            updateDoc(doc(db, 'usersProfile', user.uid),{
              following: arrayRemove(id)
            })
            updateDoc(followerRef,{
                followers: arrayRemove(user.uid),
                followersData: arrayRemove({
                    Id: user.uid,
                    name: user.name,
                    photo: user.photo,
                    email:user.email
                })
            }).then(()=> {
              if(followerReload){
                setReload(false);
              }else{
                setReload(true)
              }
            })
          }else{
            updateDoc(doc(db, 'usersProfile', user.uid),{
              following:arrayUnion(id)
            })
            updateDoc(followerRef,{
                followers: arrayUnion(user.uid),
                followersData: arrayUnion({
                    Id: user.uid,
                    name: user.name,
                    photo: user.photo,
                    email:user.email
                })
            }).then(()=> {
              if(followerReload){
                setReload(false);
              }else{
                setReload(true)
              }
            })
          }
    })
}
const nameChangeHandle = async() =>{
  if(Name.length < 3){
    alert('Not an appropriate Name')
  }else{
    const nameRef = doc(db, 'usersProfile', id)
    updateDoc(nameRef,{
      name: Name
    }).then(async()=>{
      const postUpdate = collection(db, "users")
      const postQuery = query(postUpdate, where('post_useruid', '==', id))
      const rawData = getDocs(postQuery)
      const data = (await rawData).docs.map((item)=>{
        updateDoc(item.ref, {
          userName: Name
        }).then(navigate('/feed'))
      })
      const commentUpdate =collection(db, 'comments')
      const commentQuery = query(commentUpdate, where('post_useruid', '==', id))
      const commentRawData = await getDocs(commentQuery)
      const updateData = commentRawData.docs.map((name)=>{
        updateDoc(name.ref,{
          commnetProfile: Name
        })
      })
    }
    )
  }
}
const updateDescp = async() => {
  event.preventDefault();
  
  if(descp.length <1){
   alert('Add an appropriate description')
  }else{
    const updateRef = doc(db, 'usersProfile', id)
    updateDoc(updateRef,{
      description: descp
    })
    setloading(false)
  }
}

const getSavedPosts = async() => {
  const queryRef = collection(db, 'saved')
  const savedQuery = query(queryRef, where('savedby', '==', user.uid), orderBy('savedby'))
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
useEffect(()=> handlePosts, [])
  useEffect(()=> getProfile, [nameBtn, followerReload])
  useEffect(()=>{
    if(user.uid !== id){
    setDisable(true)
  }else{
    setDisable(false)
  }
  },[])
  useEffect(()=> getSavedPosts, [user])
  useEffect(()=> {
    const unique = [...new Map(saved.map(item => [item['Id'], item])).values()]
    setuniqueSaved(unique)
  },[saved])
  return (
    <section className='flex bg-main text-dim-white min-h-screen'>
    <div className=''>
      <Nav/>
    </div>
    {Loading && <div className='sticky top-10 grid grid-cols-1 w-full place-content-center'>
      <div className=' flex flex-col w-2/3 items-center justify-end m-auto'>
          <div className='flex w-full justify-center items-start'>
            <section className='flex w-full items-start justify-start'>
            <ProfilePicture profile={profile}/>
              <div className='w-9/12 m-auto'>
                  <div className='flex'>
                    <Tooltip placement='right' color='volcano' title={'Edit the name by clicking on it'}>
                      <input type="text" disabled={inputDisable} onChange={(e)=> setName(e.target.value)} className='bg-transparent w-11/12 outline-0 font-bold text-xl' defaultValue={profile.name} onClick={()=> {if(nameBtn){setnameBtn(false)}else{setnameBtn(true)}}}/>
                    </Tooltip>
                    <button onClick={nameChangeHandle} className={nameBtn ? 'block': 'hidden'}>
                      <Avatar size={'small'} icon={<RightOutlined />} className='bg-main'/>
                    </button>
                  </div>
                  <h1 className='text-xs font-normal italic text-dim-white'>{profile.username}</h1>
                  <div className='w-full mt-5 flex items-start justify-center'>
                    <Tooltip placement='right' title={'Edit the description by clicking on it'} color='volcano'>
                      <textarea type="text" disabled={inputDisable} defaultValue={profile.description} onChange={(e)=> setDescpText(e.target.value)} onClick={()=>{if(showDescp){ setDescp(false)}else{setDescp(true)}}} className='w-full bg-transparent outline-0 text-xl font-thin' />
                    </Tooltip>
                  <button onClick={updateDescp}>
                  <Avatar icon={<RightOutlined/>} size={'small'} className={showDescp ? 'bg-main flex': 'hidden'}/>
                  </button>
                  </div>
                </div>
            </section>
            <section className=' flex w-9/12 items-center justify-between'>
              <div className='flex flex-col items-center border-r-2 px-8 border-dimest'>
                <h1 className='text-2xl font-bold'>{profilePosts.length}</h1>
                <h1 className='text-lg font-normal'>Posts</h1>
              </div>
              <div className='flex flex-col items-center px-8'>
                <h1 className='text-2xl font-bold'>{profile?.followers.length}</h1>
                <h1 className='text-lg font-normal'>Followers</h1>
              </div>
              <div className='flex flex-col items-center border-l-2 px-8 border-dimest'>
                <h1 className='text-2xl font-bold'>{profile?.following.length}</h1>
                <h1 className='text-lg font-normal'>Following</h1>
              </div>
            </section>
          </div>
        </div>
        {
          inputDisable ?
            <div className='w-1/6 flex items-center my-5 justify-center m-auto'>
              <button onClick={()=> handleFollowerSingle(id)} className='border w-full rounded-md bg-secondary border-dimest text-xl py-1 font-semibold'>
                Follow
              </button>
            </div>  :
        <div className='w-2/3 m-auto mt-10 mb-2'>
        <div className='w-1/12'>
          <label htmlFor="file" className=''>
            <Avatar icon={<PlusOutlined/>} className='outline outline-dimest bg-secondary flex items-center justify-center p-7 font-bold text-dim-white opacity-90' style={{fontSize: '150%'}} />
            <input type="file" id='file' className='hidden'/>
          </label>
          <h1 className='mt-2 text-sm font-thin opacity-80'>Add New</h1>
        </div>
      </div>
        }
        <div className='gap-4 overflow-y-scroll h-96 place-content-start grid grid-cols-3 w-2/3 m-auto border-t border-dim-white'>
            <div className={user.uid === id ? 'col-span-3 flex items-center': 'col-span-3 m-auto'}>
              <button className={showPosts? 'm-auto text-white' : 'opacity-50 m-auto'} key='1' onClick={()=> {setshowPosts(true)
              setshowSaved(false)}}>
                <Avatar className='bg-main' size={'large'} icon={<TableOutlined />}/>
              </button>
              <button className={showSaved ? 'm-auto' : 'm-auto opacity-50'} key='2' onClick={()=> {setshowSaved(true)
              setshowPosts(false)}}>
                <Avatar className={user.uid === id ? 'bg-main': 'hidden'} size={'large'} icon={<TabletOutlined />}/>
              </button>
            </div>
        {profilePosts.map((item)=> {
          return <Link className={showPosts ? '': 'hidden'} to={`/comments/${item.Id}`}>
            <motion.div
            animate={showPosts ? 'open' : 'closed'}
            variants={variant}>
              <Image preview={false} src={item.post_image} className='rounded-xl hover:brightness-50 transition ease-in-out  delay-100 duration-100'/>
            </motion.div>
          </Link>
        })}
        {
          uniqueSaved.map((item)=>{
            return <Link className={showSaved ? '' : 'hidden'} to={`/comments/${item.Id}`}>
            <motion.div
            animate={showSaved ? 'open' : 'closed'}
            variants={variant}
            >
              <Image src={item.post_image} preview={false} className='rounded-xl hover:brightness-50 transition ease-in-out  delay-100 duration-100'/>
            </motion.div>
            </Link>
          })
        }
        </div>
    </div> }
  </section>
  )
}

export default ProfileSingle