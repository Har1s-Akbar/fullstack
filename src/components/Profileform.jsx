import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  ColorPicker,
  Form,
  InputNumber,
  Select,
  Space,
  Upload,
} from 'antd';
import ImgCrop from 'antd-img-crop'
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
function Profileform (){
  const [filelist, setFileList] = useState([])
  const normFile = (e) => {
    setFileList(e)
    console.log(filelist)
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  return(
  <section className='flex flex-col items-center justify-center w-full'>
    <div className='text-center'>
    <h1 className='text-xl font-normal'>Help Us Set Your</h1>
    <h1 className='text-5xl my-5'>
    Profile
    </h1>
    </div>
    <Form
    name="validate_other"
    size='medium'
    {...formItemLayout}
    onFinish={onFinish}
    initialValues={{
      'input-number': 18,
      'color-picker': null,
    }}
    style={{
      maxWidth: 600,
    }}
  >
    
    <section className='flex w-full'>
    <div>
    <Form.Item label="Dragger">
      <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
      <ImgCrop>
        <Upload accept='.png, .jpeg' maxCount={1} listType='picture-circle' beforeUpload={()=> false}>
          {filelist.length === 0 && 'upload'}
        </Upload>
      </ImgCrop>
      </Form.Item>
    </Form.Item>
    <Form.Item
      name="Pick your favourite colour"
      label="ColorPicker"
      rules={[
        {
          required: true,
          message: 'color is required!',
        },
      ]}
    >
      <ColorPicker />
    </Form.Item>

    </div>
    <div>
    <Form.Item label="Name" name='name' rules={[{ required: true, message: 'Please input your Name!' }]}>
      <Input placeholder='Joh Doe' className=''/>
    </Form.Item>
    <Form.Item label="User Name" name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
      <Input placeholder='@johndoe'/>
    </Form.Item>
    <Form.Item label="Description" name='description' rules={[{ required: true, message: 'Please input your profile Description!' }]}>
      <TextArea rows={4} placeholder='Hey new here....'/>
    </Form.Item>
    <Form.Item
      name="select"
      label="Select"
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Please select your country!',
        },
      ]}
    >
      <Select placeholder="Please select your Gender">
        <Option value="gay">Gay</Option>
        <Option value="lesbian">Lesbian</Option>
        <Option value="queer">Queer</Option>
        <Option value="disable">Disable</Option>
        <Option value="others">Others</Option>
      </Select>
    </Form.Item>


    <Form.Item label="Age">
      <Form.Item name='input-number' noStyle>
        <InputNumber min={18} max={100} />
      </Form.Item>
      {/* <span
        className="ant-form-text"
        style={{
          marginLeft: 8,
        }}
      >
        Years old
      </span> */}
    </Form.Item>

    </div>

    </section>
    <Form.Item
      wrapperCol={{
        span: 12,
        offset: 6,
      }}
    >
      <Space>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="reset">reset</Button>
      </Space>
    </Form.Item>
  </Form>
  </section>)
};
export default Profileform;