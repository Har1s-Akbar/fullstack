import React, { useState } from 'react';
import { auth } from '../auth/firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  HomeFilled,
  PlusOutlined,
  SettingFilled,
  ContactsFilled,
  BellFilled,
  UserOutlined
} from '@ant-design/icons';
import { Button, Menu, ConfigProvider } from 'antd';
import { v4 } from 'uuid';
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const App = () => {
  const [currentKey, setKey] = useState('1')
  const uniq = v4();
  const User = useSelector((state)=> state.reducer.copyUserdata)
  const items = [
    getItem(<a href="/feed"></a> , '1', <HomeFilled style={{fontSize:'140%'}} />),
    getItem(<a href="#"></a>, '2', <ContactsFilled style={{fontSize:'140%'}} />),
    getItem(<a href={`/profile/${User.uid}`}><img className='rounded-full w-10' src={User.photo} alt="" /></a>, '3'),
    
    getItem(<a href={`/create/${uniq}`}></a>, 'sub2', <PlusOutlined style={{fontSize:'140%'}} />),
    getItem('', 'sub1', <SettingFilled style={{fontSize:'140%'}} />, [
      getItem('Sign Out', '5'),
      getItem(<a href="/signup">Sign Up</a>, '6'),
    ]),
  ];
  const itemLap = [
    getItem(<a href="/feed"></a> , '1', <HomeFilled style={{fontSize:'120%'}} />),
    getItem(<a href="#"></a>, '2', <ContactsFilled style={{fontSize:'120%'}} />),
    // getItem(<a href="#"><img className='rounded-full w-10' src={User.photo} alt="" /></a>, '3'),
    
    getItem(<a href="/notifications"></a>, 'sub2', <BellFilled style={{fontSize:'120%'}} />),
    getItem('', 'sub1', <SettingFilled style={{fontSize:'120%'}} />, [
      getItem('Sign Out', '5'),
      getItem(<a href="/signup">Sign Up</a>, '6'),
    ]),
  ];
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
    <div className='lg:sticky lg:ml-16 lg:top-48'
    >
      {/* </Button> */}
      <Menu
        onClick={handleClick}    
        mode="inline"
        theme='dark'
        className='bg-secondary sm:hidden lg:block rounded-full text-dim-white '
        inlineCollapsed={true}
        items={itemLap}
      />
      <Menu
        onClick={handleClick}    
        mode="horizontal"
        theme='dark'
        className='bg-secondary lg:p-0 lg:rounded-full lg:hidden text-dim-white '
        items={items}
      />
    </div>
  );
};
export default App;