import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, where, query, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore/lite'
import { db } from '../auth/firebaseConfig'
import Nav from './Nav'
import { Avatar, Image } from 'antd'
import { PlusOutlined, TableOutlined, TabletOutlined, CloseOutlined, RightOutlined, PlusCircleOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProfileSingle() {
  const {id} = useParams()
  const navigate = useNavigate()
  const [profilePosts, setprofilePosts] = useState([])
  const [Name, setName] = useState('')
  const [showDescp, setDescp] = useState(false)
  const [nameBtn, setnameBtn] = useState(false)
  const[inputDisable, setDisable] = useState(true);
  const [Loading, setloading] = useState(false)
  const [descp, setDescpText] = useState('')
  const user = useSelector((state)=> state.reducer.copyUserdata)
  const [profile, setprofile] = useState([])
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
          const followersData = data.followersData 
          if(followersArray.includes(user.uid)){
            setIsFollower(false)
            updateDoc(followerRef,{
              following: arrayRemove(id),
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
              following: arrayUnion(id),
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
  useEffect(()=> handlePosts, [])
  useEffect(()=> getProfile, [nameBtn])
  useEffect(()=>{
    if(user.uid !== id){
    setDisable(true)
  }else{
    setDisable(false)
  }
  },[])
  return (
    <section className='flex bg-main min-h-screen text-dim-white'>
    <div className='w-1/5'>
      <Nav/>
    </div>
    {Loading && <div className='grid grid-cols-1 items-center place-content-center rounded-xl'>
        <div className='flex flex-col w-full items-center justify-end m-auto'>
          <div className='flex w-full justify-center items-start'>
            <section className='flex w-4/12 items-start justify-start'>
            <section className='w-1/3'>
              <Image src={profile.photo} sizes={'large'} className='w-96 rounded-full'/>
            </section>
              <div className='w-full m-auto'>
                  <div className='flex'>
                    <input type="text" disabled={inputDisable} onChange={(e)=> setName(e.target.value)} className='bg-transparent w-11/12 outline-0 font-bold text-xl' defaultValue={profile.name} onClick={()=> {if(nameBtn){setnameBtn(false)}else{setnameBtn(true)}}}/>
                    <button onClick={nameChangeHandle} className={nameBtn ? 'block': 'hidden'}>
                      <Avatar size={'small'} icon={<RightOutlined />}/>
                    </button>
                  </div>
                  <h1 className='text-xs font-normal italic text-dim-white'>@harisak</h1>
                  <div className='w-full mt-5 flex items-start justify-center'>
                  <textarea type="text" disabled={inputDisable} defaultValue={profile.description} onChange={(e)=> setDescpText(e.target.value)} onClick={()=>{if(showDescp){ setDescp(false)}else{setDescp(true)}}} className='w-full bg-transparent outline-0 text-xl font-thin' />
                  <button onClick={updateDescp}>
                  <Avatar icon={<RightOutlined/>} className={showDescp ? 'bg-main flex': 'hidden'}/>
                  </button>
                  </div>
                </div>
            </section>
            <section className='mx-10 flex items-center justify-between'>
              <div className='flex flex-col items-center mx-10'>
                <h1 className='text-2xl font-bold'>{profilePosts.length}</h1>
                <h1 className='text-lg font-normal'>Posts</h1>
              </div>
              <div className='flex flex-col items-center'>
                <h1 className='text-2xl font-bold'>{profile?.followers.length}</h1>
                <h1 className='text-lg font-normal'>Followers</h1>
              </div>
              <div className='flex flex-col items-center mx-10'>
                <h1 className='text-2xl font-bold'>0</h1>
                <h1 className='text-lg font-normal'>Following</h1>
              </div>
            </section>
          </div>
        </div>
        {
          inputDisable ?
            <div className='w-1/6 flex items-center my-5 justify-center m-auto'>
              <button onClick={handleFollowerSingle} className='border w-full rounded-md bg-secondary border-dimest text-xl py-1 font-semibold'>
                Follow
              </button>
            </div>  :
        <div className=' w-2/3 m-auto  mt-10 mb-2'>
        <label htmlFor="file" className=''>
          <Avatar icon={<PlusOutlined/>} className='outline outline-dimest bg-secondary flex items-center justify-center p-7 font-bold text-dim-white opacity-90' style={{fontSize: '150%'}} />
        </label>
        <h1 className='mt-2 text-sm font-thin opacity-80'>Add New</h1>
        <input type="file" id='file' className='hidden'/>
      </div>
        }
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
  </section>
  )
}

export default ProfileSingle