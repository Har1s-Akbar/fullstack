import React, { useState } from 'react';
import { auth } from '../auth/firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  HomeFilled,
  PlusSquareFilled,
  SettingFilled,
  ContactsFilled,
  BellFilled,
  UserOutlined
} from '@ant-design/icons';
import { Button, Menu, ConfigProvider } from 'antd';
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(<a href="/feed"></a> , '1',<HomeFilled style={{fontSize:'150%'}} />),
  getItem(<a href="#"></a>, '3', <ContactsFilled style={{fontSize:'150%'}} />),
  
  getItem(<a href="/notifications"></a>, 'sub2', <BellFilled  style={{fontSize:'150%'}}/>),
  getItem('', 'sub1', <SettingFilled style={{fontSize:'150%'}} />, [
    getItem('Sign Out', '5'),
    getItem(<a href="/signup"></a>, '6'),
  ]),
];
const App = () => {
    const [currentKey, setKey] = useState('1')
    const User = useSelector((state)=> state.reducer.copyUserdata)
    const name = User.name
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = () => {
      auth.onAuthStateChanged((current)=>{
        if(current){
          console.log('signned in')
        }else{
          console.log('signned out')
        }
      })
    }
    
    const signOutFunct = () => {
      currentUser();
      auth.signOut().then(()=>{
        console.log('signned out');
        navigate('/');
        dispatch(setUser([]));
        message.success('Logged Out Successfully')
      }).catch((error)=> 
        {console.log(error);
        message.error('Failed to log out')}
      )
    }
    
  const handleClick = (e) => {
    if(e.key === '5'){
      signOutFunct()
    }
  };
  return (
    <div className='sticky top-96 lg:ml-16 lg:top-48'
    >
      {/* </Button> */}
      <Menu
        onClick={handleClick}    
        mode='inline'
        theme='dark'
        className='bg-secondary sm:hidden lg:block lg:rounded-full text-dim-white '
        inlineCollapsed={true}
        items={items}
      />
      <Menu
        onClick={handleClick}    
        theme='dark'
        className='bg-secondary flex items-center justify-center pt-2 pl-10 lg:hidden sm:block lg:rounded-full text-dim-white '
        mode='horizontal'
        items={items}
      />
    </div>
  );
};
export default App;