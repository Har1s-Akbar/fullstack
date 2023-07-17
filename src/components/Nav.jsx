import { PlusSquareOutlined, SettingOutlined, AppstoreOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { Menu, Avatar, message,Affix } from 'antd';
import { useSelector } from 'react-redux';
import { auth } from '../auth/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slice';
import { useState } from 'react';
function getItem(label, key, icon, children, type) {
  const navigate = useNavigate()
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
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
  }
    const User = useSelector((state)=> state.reducer.copyUserdata)
    const name = User.name
    const items = [
        getItem(<a href="/profile">{name}</a>, 'sub1',<Avatar size={'large'} draggable='false' shape='square' className='drop-shadow-4xl' src={User.photo} alt={User.email}/>
        ,   [
          getItem(<a href="/posts">Posts</a>, 'g1', null,),
          getItem(<a href="/follow">Follow People</a>, 'g2', null),
        ]),
        {
            type: 'divider',
        },
        getItem(<a href="/create">Create</a>, 'sub2', <PlusSquareOutlined />,),
        {
          type: 'divider',
        },
        getItem('Communities', 'sub4', <UsergroupDeleteOutlined />, [
          getItem('Create Community', '9'),
          getItem('View Communities', '10'),
          
        ]),
        getItem('Account', 'grp', null, [getItem('Sign Out', '13'), getItem('Create New', '14')], 'group'),
      ];
  const onClick = (e) => {
    if(e.key === '13'){
      signOut();
    }
    console.log(e.key)
  };
  return (
    <Menu
      onClick={onClick}
      style={{
        width: 300,
      }}
      className='min-h-screen'
        
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
export default Nav;