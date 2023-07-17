import React from 'react';
import Nav from './Nav';
import { Button } from 'antd';
import {UploadOutlined, ArrowRightOutlined} from '@ant-design/icons';
import { db,storage } from '../auth/firebaseConfig';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { setDoc, doc, DocumentReference} from 'firebase/firestore/lite';
import { useState} from 'react';
import { useSelector } from 'react-redux';
import {v4} from 'uuid'
import { useNavigate } from 'react-router-dom';

function Create() {
  const [Description, setDescription] = useState(null);
  const [image, setImage] =useState('');
  // const user = useSelector((state)=> state.reducer.userdata);
  const user = useSelector((state)=> state.reducer.copyUserdata);
  const navigate = useNavigate()
  const setPost = async() => {
    const uniqueId = v4()
    // const collectionRef = collection(db, 'users', uniqueId);
    if(!image){
      alert("Add a picture first")
    }
    else{
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
            followers:[]
          }).then((data)=> {console.log('data added')}).catch((error)=> console.log(error))  
        });
      });
    }
  }
  return (
    <section className='flex'>
      <div>
        <Nav/>
      </div>
      <div className='w-1/2 ml-10'>
        <div className='flex items-center justify-between w-4/6'>
              <h1 className='text-5xl my-20 font-medium antialiased subpixel-antialiased tracking-wide font-mono'>Create A Post</h1>
              <Button onClick={setPost}>
                <ArrowRightOutlined style={{fontSize:'20px'}}/>
              </Button>
        </div>
        <div>
          <form className=' grid grid-cols-1'>
            <label htmlFor="file" className='text-2xl font-medium antialiased subpixel-antialiased tracking-wide font-mono my-2'>Upload photo</label>
            <input type="file" onChange={(e)=> setImage(e.target.files)} className='w-1/2 file:border-0 file:rounded-lg file:bg-blue-400 file:text-white file:italic file:font-medium file:px-4 my-10' accept='image/png, image/jpg, image/jpeg' />

            <label htmlFor="description" className='text-2xl font-medium antialiased subpixel-antialiased tracking-wide font-mono my-2'>Description</label>
            <input type="message" onChange={(e)=> setDescription(e.target.value)} placeholder='Description for your post goes here .....' className='border-0 outline-0 border-b-2 w-1/2 placeholder:italic placeholder: p-2'/>
            
            <Button className='w-1/6 mt-10' onClick={setPost} icon={<UploadOutlined />} >Submit</Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Create