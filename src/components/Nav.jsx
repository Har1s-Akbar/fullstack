import React, { useState } from 'react';
import { auth } from '../auth/firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeFilled,
  PlusSquareFilled,
  SettingFilled,
  ContactsFilled,
  BellFilled
} from '@ant-design/icons';
import { Button, Menu, ConfigProvider } from 'antd';
import { signOut } from 'firebase/auth';
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
  getItem(<a href="/profile">Home</a> , '1', <HomeFilled />),
  getItem(<a href="/create">Create</a>, '2', <PlusSquareFilled />),
  getItem(<a href="#">Communities</a>, '3', <ContactsFilled />),
  
  getItem(<a href="/notifications">Notifications</a>, 'sub2', <BellFilled />),
  getItem('Settings', 'sub1', <SettingFilled />, [
    getItem('Sign Out', '5'),
    getItem(<a href="/signup">Sign Up</a>, '6'),
  ]),
];
const App = () => {


  const Nav = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate('')
    const currentUser = () => {
      auth.onAuthStateChanged((current)=>{
        if(current){
          console.log('signned in')
        }else{
          console.log('signned out')
        }
      })
    }
    
    const signOut = () => {
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
    }}
    const User = useSelector((state)=> state.reducer.copyUserdata)
    const name = User.name

  const [currentKey, setKey] = useState('1')
  const onClick = (e) => {
    if(e.key === '5'){
      signOut()
    }
    setKey(e.key)
  };
  return (
    <div className='sticky ml-16 top-48'
    >
      {/* </Button> */}
      <Menu
        defaultSelectedKeys={['1']}
        selectedKeys={currentKey}
        onClick={onClick}    
        mode="inline"
        theme='dark'
        className='bg-secondary rounded-full text-dim-white '
        inlineCollapsed={true}
        items={items}
      />
    </div>
  );
};
export default App;