import React, { useEffect } from 'react';
import Nav from './Nav';
import { Upload, Modal, Image, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { db,storage } from '../auth/firebaseConfig';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { setDoc, doc, serverTimestamp} from 'firebase/firestore/lite';
import { useState} from 'react';
import { useSelector } from 'react-redux';
import {v4} from 'uuid'
import { useNavigate } from 'react-router-dom';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function Create() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [Description, setDescription] = useState(null);
  const [fileList, setFileList] = useState([])
  const user = useSelector((state)=> state.reducer.copyUserdata);
  const navigate = useNavigate()

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const handleCancel = () => setPreviewOpen(false);
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const setPost = async() => {
    event.preventDefault()
    const uniqueId = v4()
    if(!fileList){
      message.error('Please Add Image')
    }
    else{
      message.loading('Post is being Added', 5)
      const imageRef = ref(storage, `/image/${fileList[0].name + v4()} `);
      const Img = await uploadBytes(imageRef, fileList[0].originFileObj).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url)=>{
          setDoc(doc(db, "users", uniqueId), {
            Id : uniqueId,
            description: Description,
            post_image: url,
            userName: user.name,
            userEmail: user.email,
            username: user.username,
            userPhoto:user.photo,
            post_useruid: user.uid,
            isVerified: user.Isverified,
            likes: [],
            time: serverTimestamp(),
            editedAt: null
          }).then(()=> {
            navigate(`/comments/${uniqueId}`)
          message.success('Post Added', 1)
          }).catch((error)=> console.log(error))  
        });
      });
    }
  }
  return (
    <section className='w-full text-dim-white'>
      <div className='w-full flex flex-col bg-secondary rounded-xl m-auto py-5'>
        <div className=' w-11/12 m-auto'>
          <div className='w-full'>
            <div className='flex items-center'>
            <div className='w-2/5'>
            <Image src={user.photo} className=' rounded-full' />
            </div>
            <div className='w-full ml-4'>
              <h1 className='text-xl font-semibold'>{user.name}</h1>
              <p className='text-xs font-normal italic'>@{user.username}</p>
            </div>
            </div>
          </div>
          <div className=''>
            <input type="text" onChange={(e)=> setDescription(e.target.value)} className=' w-9/12 bg-transparent outline-0 mt-5 placeholder:text-base text-sm font-semibold' placeholder="what's on your mind?"/>
          </div>
          <div className='w-2/5 m-auto mt-2'>
        <ImgCrop rotationSlider showReset={true} aspect={2/1}>
        <Upload 
        style={{aspectRatio: 2/1}}
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          onPreview={handlePreview}
        >
          {fileList.length === 0 && '+ Upload'}
        </Upload>
      </ImgCrop>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img
            alt="example"
            style={{
              width: '100%',
            }}
            src={previewImage}
          />
        </Modal>
          </div>
        </div>
        <button onClick={setPost} className='border w-1/2 m-auto rounded my-3 border-dim-white hover:bg-dim-white hover:text-main transition ease-in-out delay-200 duration-200'>Post</button>
      </div>
    </section>
  )
}

export default Create