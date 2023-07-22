import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, where, query, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore/lite'
import { db } from '../auth/firebaseConfig'
import Nav from './Nav'
import { Avatar, Image } from 'antd'
import { PlusOutlined, TableOutlined, TabletOutlined, CloseOutlined, RightOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProfileSingle() {
  const {id} = useParams()
  const navigate = useNavigate()
  const [profilePosts, setprofilePosts] = useState([])
  const [Name, setName] = useState('')
  const [nameBtn, setnameBtn] = useState(false)
  const [Loading, setloading] = useState(false)
  const user = useSelector((state)=> state.reducer.copyUserdata)
  const [profile, setprofile] = useState([])
  const handlePosts = async() =>{
    const queryRef = collection(db, 'users')
    const queryPosts = query(queryRef, where("post_useruid", "==", id))
    const queryData = await getDocs(queryPosts)
    const data = queryData.docs.map((item)=> {return item.data()})
    setprofilePosts(data)
    console.log(data) 
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
const showNameSubmit = () => {
  if(nameBtn){
    setnameBtn(false)
  }else{
    setnameBtn(true)
  }
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
  useEffect(()=> handlePosts, [])
  useEffect(()=> getProfile, [nameBtn])
  return (
    <section className='flex bg-main min-h-screen text-dim-white'>
    <div className='w-1/5'>
      <Nav/>
    </div>
    {Loading && <div className='grid grid-cols-1 items-center place-content-center rounded-xl'>
        <div className='flex flex-col w-1/2 items-center justify-end m-auto'>
          <div className='flex items-start justify-center'>
            <section>
            <div className='flex items-start w-full'>
            <div className='relative'>
              <Image src={profile.photo} preview={false} className='rounded-full w-full'/>
              <Avatar icon={<PlusOutlined/>} className='absolute bottom-1 right-1 bg-blue-500 flex items-center justify-center'/>
            </div>
            <div className='flex mx-10 mt-2 flex-col items-start justify-start'>
              <div className=''>
                <div className='flex'>
                <input type="text" onChange={(e)=> setName(e.target.value)} placeholder={profile.name} className='bg-transparent outline-0 placeholder:text-xl placeholder:font-semibold placeholder:text-dim-white text-xl' onClick={showNameSubmit}/>
                <button onClick={nameChangeHandle} className={nameBtn ? 'block': 'hidden'}><RightOutlined /></button>
                </div>
                {/* <h1 className='text-xl font-semibold text-dim-white'>{profile.name}</h1> */}
                <h1 className='text-xs font-normal italic text-dim-white'>@harisak</h1>
              </div>
              <div className='mt-5'>
                <h1 className='text-thin'>{profile.description}</h1>
              </div>
            </div>
            </div>
          </section>
          <section className='mx-10 flex items-center justify-between'>
            <div className='flex flex-col items-center'>
              <h1 className='text-2xl font-bold'>{profile?.followers.length}</h1>
              <h1 className='text-lg font-semibold'>Followers</h1>
            </div>
            <div className='flex flex-col items-center mx-10'>
              <h1 className='text-2xl font-bold'>0</h1>
              <h1 className='text-lg font-semibold'>Following</h1>
            </div>
          </section>
          </div>
          <div className='w-1/6 m-auto my-10 relative'>
              <button className='border-2 px-4 outline-0 py-1 rounded-lg border-dim-white '>Edit Profile</button>
          </div>
        </div>
        <div className='gap-4 overflow-y-scroll grid grid-cols-3 w-2/3 m-auto border-t border-dim-white'>
            <div className='col-span-3 flex items-center '>
              <button className='m-auto' key='1'>
              <Avatar className='bg-main' size={'large'} icon={<TableOutlined />}/>
              </button>
              <button className=' m-auto' key='2'>
              <Avatar className='bg-main' size={'large'} icon={<TabletOutlined />}/>
              </button>
            </div>
        {profilePosts.map((item)=> {
          return <Link to={`/comments/${item.Id}`}>
            <div>
              <Image preview={false} src={item.post_image} className='rounded-xl hover:brightness-50 transition ease-in-out  delay-100 duration-100'/>
            </div>
          </Link>
        })}
        </div>
    </div> }
          {/* <div className={showEdit ? 'bg-secondary flex flex-col absolute z-10 left-96 top-40 rounded-xl w-1/2 m-auto items-center ' : 'hidden'}>
            <div className='flex items-center justify-between w-11/12'>
            <h1 className='text-2xl font-medium my-5 '>Edit profile Information</h1>
            <button>
              <Avatar icon={<CloseOutlined />} onClick={()=> {setEdit(false)}} className='bg-secondary'/>
            </button>
            </div>
            <div className='w-11/12'>
              <div className='flex flex-col w-1/3 my-5'>
                <label htmlFor="" className='my-2 text-base font-bold'>Name</label>
                <input type="text" className='bg-transparent outline-0 border-b border-dim-white placeholder:text-base placeholder:font-semibold placeholder:italic' placeholder={profile.name}/>
              </div>
              <div className='flex flex-col w-1/2 my-5'>
                <label htmlFor="" className='my-2 text-base font-bold'>Username</label>
                <input type="text" className='bg-transparent outline-0 border-b border-dim-white placeholder:text-base placeholder:font-semibold placeholder:italic' placeholder={profile.username}/>
              </div>
              <div className='flex flex-col w-full'>
                <label htmlFor="" className='my-2 text-base font-bold'>Description</label>
                <input type="text" className='bg-transparent w-full outline-0 border-b border-dim-white placeholder:text-base placeholder:font-semibold placeholder:italic' placeholder={profile.description}/>
              </div>
            </div>
            <div className='w-1/5 my-5'>
            <button className='border-2 w-full rounded'>
              Edit
            </button>
            </div>
          </div> */}
  </section>
  )
}

export default ProfileSingle