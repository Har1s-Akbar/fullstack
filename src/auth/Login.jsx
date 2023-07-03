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
    <div>
      <button className='text-md text-white px-2 py-1 rounded-lg bg-blue-800' onClick={handelClick}>Sign In</button>
    </div>
  )
}

export default Login