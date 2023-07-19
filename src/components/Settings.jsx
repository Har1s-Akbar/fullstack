import React from 'react';
import { DownOutlined, BarsOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
const items = [
  {
    key: '1',
    label: 'Delete',
  },
  {
    key: '2',
    label: 'Edit',
  },
  {
    key: '3',
    label: 'Report',
  },
];

const Settings = () => (

  <Dropdown
    menu={{
      items,
      selectable: true,
      defaultSelectedKeys: ['3'],
    }}
  >
    <button className='' style={{fontSize: '150%'}}>
    <BarsOutlined/>
    </button>
  </Dropdown>
);
export default Settings;