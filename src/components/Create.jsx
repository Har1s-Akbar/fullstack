import React from 'react';
import Nav from './Nav';
import { Upload,Button } from 'antd';
import {UploadOutlined, ArrowRightOutlined} from '@ant-design/icons';
import { db,storage } from '../auth/firebaseConfig';
import {ref, uploadBytes} from 'firebase/storage'
import {collection, addDoc} from 'firebase/firestore/lite';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


function Create() {
  const [Description, setDescription] = useState('');
  const [image, setImage] =useState('')
  const user = useSelector((state)=> state.reducer.userdata);
  const collectionRef = collection(db, 'users');
  const imageRef = ref(storage, image)
  console.log(user)
  const setPost = () => {
    uploadBytes(imageRef, file).then((snapshot)=>{
      console.log('image uploaded')
    })
    addDoc(collectionRef, {
    description: Description,
    userName: user.displayName,
    userEmail: user.email,
    userPhoto:user.photoURL,
    post_useruid: user.uid,
    isVerified: user.emailVerified
  }).then(()=> console.log('data added')).catch((error)=> console.log(error))
  }
  return (
    <section className='flex'>
      <div className=''>
        <Nav/>
      </div>
      <div className='w-full ml-10'>
        <div className='flex items-center justify-between w-1/2'>
              <h1 className='text-5xl my-20 font-medium antialiased subpixel-antialiased tracking-wide font-mono'>Create A Post</h1>
              <Button onClick={setPost}>
                <ArrowRightOutlined style={{fontSize:'20px'}}/>
              </Button>
        </div>
        <div>
          <form className=' grid grid-cols-1'>
            <label htmlFor="file" className='text-2xl font-medium antialiased subpixel-antialiased tracking-wide font-mono my-2'>Upload photo</label>
            <Upload name='post' listType='picture' className='my-10'>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>

            <label htmlFor="description" className='text-2xl font-medium antialiased subpixel-antialiased tracking-wide font-mono my-2'>Description</label>
            <input type="message" onChange={(e)=> setDescription(e.target.value)} placeholder='Description for your post goes here .....' className='border-0 outline-0 border-b-2 w-1/2 placeholder:italic placeholder: p-2'/>
            
            <Button className='w-1/6 mt-10' icon={<UploadOutlined />} >Submit</Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Create