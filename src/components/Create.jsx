import React, { useEffect } from 'react';
import Nav from './Nav';
import { Image, Avatar } from 'antd';
import {BarsOutlined} from '@ant-design/icons';
import { db,storage } from '../auth/firebaseConfig';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { setDoc, doc, DocumentReference, serverTimestamp} from 'firebase/firestore/lite';
import { useState} from 'react';
import { useSelector } from 'react-redux';
import {v4} from 'uuid'
import { useNavigate } from 'react-router-dom';

function Create() {
  const [Description, setDescription] = useState(null);
  const [image, setImage] =useState('');
  const [previewImage, setPrevviewImage] =useState(null);
  const [Preview, setPreview] = useState(false)
  // const user = useSelector((state)=> state.reducer.userdata);
  const user = useSelector((state)=> state.reducer.copyUserdata);
  const navigate = useNavigate()
  const setPost = async() => {
    event.preventDefault()
    const uniqueId = v4()
    // const collectionRef = collection(db, 'users', uniqueId);
    if(!image){
      alert("Add a picture first")
    }
    else{
      setPrevviewImage(URL.createObjectURL(image[0]))
      const imageRef = ref(storage, `/image/${image[0].name + v4()} `);
      const Img = await uploadBytes(imageRef, image[0]).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url)=>{
          setDoc(doc(db, "users", uniqueId), {
            Id : uniqueId,
            description: Description,
            post_image: url,
            userName: user.name,
            userEmail: user.email,
            userPhoto:user.photo,
            post_useruid: user.uid,
            isVerified: user.Isverified,
            likes: [],
            comments: [],
            followers:[],
            time: serverTimestamp(),
            editedAt: null
          }).then((data)=> {navigate(`/comments/${uniqueId}`)}).catch((error)=> console.log(error))  
        });
      });
    }
  }
  console.log(previewImage)
  const preview = () => {
    event.preventDefault()
    if (image.length > 0) {
      setPrevviewImage(URL.createObjectURL(image[0]))
      setPreview(true)
    }else{
      alert('add image first')
      setPreview(false)
    }
  }
  console.log(previewImage)
  return (
    <section className='flex bg-main min-h-screen text-dim-white'>
      <div>
        <Nav/>
      </div>
      <div className='w-1/2 bg-secondary rounded-xl m-auto py-5'>
        <div className=''>
              <h1 className='text-5xl my-20 font-medium antialiased subpixel-antialiased tracking-wide font-mono text-center'>Create A Post</h1>
        </div>
        <div className=''>
          <form className='flex flex-col items-center justify-center w-ful'>
            <label htmlFor="file" className='text-2xl font-medium antialiased subpixel-antialiased px-10 py-20 bg-dimest w-1/2 rounded tracking-wide my-2 text-center'>+ Upload photo</label>
            <input type="file" id='file' onChange={(e)=> setImage(e.target.files)} className='hidden' accept='image/png, image/jpg, image/jpeg' />

              <label htmlFor="description" className='text-2xl text-left font-medium antialiased subpixel-antialiased tracking-wide my-2 font-medium'>Description</label>
              <input type="message" onChange={(e)=> setDescription(e.target.value)} placeholder='Description for your post goes here .....' className='border-0 outline-0 border-b-2 w-1/2 placeholder:italic placeholder: p-2 bg-secondary'/>
            
            <div className='flex w-full items-center justify-center'>
            <button className='w-1/6 mt-10 border-2 transition duration-100 delay-100 ease-in hover:bg-dim-white hover:text-secondary mx-3 rounded py-1' onClick={setPost} >Post</button>
            <button className='w-1/6 mt-10 border-2 transition duration-100 delay-100 ease-in hover:bg-dim-white hover:text-secondary rounded py-1' onClick={preview} >Preview</button>
            </div>
          </form>
        </div>
      </div>
      <div className='w-1/3 bg-secondary rounded-xl m-auto py-5'>
      <h1 className='text-center text-xl font-dim-white font-bold'>Preview</h1>
      {
        Preview ? <div className='bg-secondary ml-14 rounded-xl flex my-5 justify-between'>
        <div className=''>
          <div className='w-full flex items-satrt justify-between mt-3 border-b-2 pb-5 border-dimest'>
            <div className='flex ml-3 items-center'>
              <Image src={user.photo} className='rounded-full' preview={false} width={40}/>
              <div className='flex flex-col items-start mx-3'>
                <h1 className='text-dim-white font-semibold text-sm'>{user.name}</h1>
                <p className='italic text-xs font-bold'>@harisak</p>
                <p className='text-xs text-dim-white my-2 font-semibold'>{Description}</p>
              </div>
            </div>
            <div className='mr-5'>
              <Avatar icon={<BarsOutlined />} className='bg-secondary'/>
            </div>
          </div>
          <div className='w-full'>
            <p className='text-xs font-bold opacity-80 text-center my-2'>Comments Here</p>
          </div>
        </div>
      <div className='w-3/5 flex'>
        <Image src={previewImage} className='rounded-xl '/>
      </div> 
      </div> : <div className='text-base font-medium text-dim-white opacity-80 text-center my-20'>Add an Image for the Preview</div>
      }
      </div>
    </section>
  )
}

export default Create