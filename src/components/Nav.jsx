import { PlusSquareOutlined, SettingOutlined, AppstoreOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { Menu, Avatar } from 'antd';
import { useSelector } from 'react-redux';
function getItem(label, key, icon, children, type) {
  return {
        key,
    icon,
    children,
    label,
    type,
  };
}
const Nav = () => {
    const User = useSelector((state)=> state.reducer.userdata)
    const name = User.displayName
    const items = [
        getItem(name, 'sub1',<Avatar size={'large'} draggable='false' shape='square' className='drop-shadow-4xl' src={User?.photoURL} alt={User.email}/>
        , [
          getItem('Posts', 'g1', null,),
          getItem('Followers', 'g2', null),
        ]),
        {
            type: 'divider',
        },
        getItem('Create', 'sub2', <PlusSquareOutlined />),
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
    console.log('click ', e);
  };
  return (
    <Menu
      onClick={onClick}
      style={{
        width: 256,
      }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
export default Nav;