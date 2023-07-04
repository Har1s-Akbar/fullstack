import React from 'react'
import {auth, provider} from './firebaseConfig'
import {signInWithPopup} from 'firebase/auth'
import {useSelector, useDispatch} from 'react-redux'
import store from '../store/store'
import { AuthFail, AuthSuccess, setUser } from '../store/slice'

function Login() {
  const dispatch = useDispatch();
  const handelClick = () =>{
    signInWithPopup(auth,provider).then((result)=>{
      const user = result.user;
      dispatch(setUser(user));
      dispatch(AuthSuccess())
    }).catch((error) => {
      console.log(error);
      dispatch(setUser([]))
      dispatch(AuthFail())
    });
  };
  // setTimeout(() => {
  //   console.log(store.getState())
  //   console.log(User)
  // }, 1000);
  return (
    <div className='flex justify-center px-2 rounded-lg bg-white items-center'>
      <button className='text-base subpixel-antialiased antialiased font-semibold mx-2' onClick={handelClick}>Sign In with Google</button>
      <img width="100" height="100" className='w-1/4' src="https://img.icons8.com/clouds/100/google-logo.png" alt="google-logo"/>
    </div>
  )
}

export default Login