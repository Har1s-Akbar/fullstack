import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  ColorPicker,
  Modal,
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

const getBase64 = (file) =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});
const formItemLayout = {
  labelCol: {
    span: 30,
  },
  wrapperCol: {
    span: 30,
  },
};
function Profileform (){
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [filelist, setFileList] = useState([])
  const normFile = (e) => {
    setFileList(e)
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  console.log(filelist)
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  return(
  <section className='flex flex-col items-center justify-center w-full mt-10'>
    <div className='text-center'>
    <h1 className='text-xl font-normal'>Help Us Set Your</h1>
    <h1 className='text-7xl font-thin  my-6'>
    Profile
    </h1>
    </div>
    <Form
    className='p-10 rounded-lg shadow-2xl'
    layout='vertical'
    name="validate_other"
    size='medium'
    {...formItemLayout}
    onFinish={onFinish}
    initialValues={{
      'input-number': 18,
      'color-picker': null,
    }}
  >
    <div className='flex items-center justify-center flex-col'>

    <section className='flex w-full items-center justify-center'>
    <div className='w-full flex flex-col'>
    <Form.Item label="Profile Picture" rules={[
        {
          required: true,
          message: 'profile picture is required',
        },
      ]}>
      {/* <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle> */}
      <ImgCrop rotationSlider>
      <Upload
      beforeUpload={()=> false}
      maxCount={1}
        listType="picture-circle"
        onChange={handleChange}
        onPreview={handlePreview}
      >
        {filelist.length < 1 && '+ Upload'}
      </Upload>
    </ImgCrop>
    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
      {/* </Form.Item> */}
    </Form.Item>
    <Form.Item
      name="colorPicker"
      
      label="Select your favourite color"
      rules={[
        {
          required: true,
          message: 'color is required!',
        },
      ]}
    >
      <ColorPicker />
    </Form.Item>

    <Form.Item label="Age">
      <Form.Item name='input-number' noStyle>
        <InputNumber min={18} max={100} />
      </Form.Item>
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
      <TextArea rows={3} placeholder='Hey new here....'/>
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

    </div>
    </section>
    <Form.Item
      wrapperCol={{
        span: 12,
        offset: 6,
      }}
    >
      <Space>
        <Button type="primary" className='bg-blue-600' htmlType="submit">
          Submit
        </Button>
        <Button htmlType="reset" className='' type='primary bg-orange-500'>reset</Button>
      </Space>
    </Form.Item>
    </div>
  </Form>
  </section>
)};
export default Profileform;