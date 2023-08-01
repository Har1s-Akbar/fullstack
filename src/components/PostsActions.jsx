import React from 'react'
import { useDispatch, useSelector} from 'react-redux';
import { db } from '../auth/firebaseConfig';
import { doc, collection, arrayRemove,arrayUnion, updateDoc, getDoc, setDoc, serverTimestamp,deleteDoc } from 'firebase/firestore/lite';
import { Avatar,message } from 'antd';
import { LikeOutlined, MessageOutlined , SendOutlined, BookOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { setReload } from '../store/postSlice';

function PostsActions({item}) {
    const user = useSelector((state)=> state.reducer.userdata);
    const CopyUser = useSelector((state)=> state.reducer.copyUserdata)  
    const [ render, setRender] = useState(false)
    const dispatch = useDispatch()
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
                dispatch(setReload())
            }
            else{
                updateDoc( updateRef,{
                    likes: arrayUnion(user.uid)
                })
                dispatch(setReload())
                setRender(false)
            }
        })
    }

    const savePost = async(id) => {
        event.preventDefault();
        const documentRef = doc(db, 'users', id)
        const getSave = await getDoc(doc(db, 'saved', id))
        
        if(getSave.exists() === true){
          const remove = deleteDoc(doc(db, 'saved' , id)).then(()=> {message.info('Post Unsaved Successfully')})
          dispatch(setReload())
        }else{
          const postSave = setDoc(doc(db, 'saved', id),{
            savedby: user.uid,
            postId : id,
            savedAt: serverTimestamp(),
            ref: documentRef,
          }).then(()=> {message.success('Post Saved successfully')
        })
        dispatch(setReload())
        }
      }

  return (<div className='bg-secondary rounded-xl w-full py-5 '>
  <div className='flex items-center w-11/12 m-auto justify-between'>
    <button onClick={()=> handleLikes(item.Id)} className='flex items-center'>
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
  )
}

export default PostsActions