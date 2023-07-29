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
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
const normFile = (e) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const onFinish = (values) => {
  console.log('Received values of form: ', values);
};
const Profileform = () => (
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

    {/* <Form.Item name="switch" label="Switch" valuePropName="checked">
      <Switch />
    </Form.Item> */}

    {/* <Form.Item name="slider" label="Slider">
      <Slider
        marks={{
          0: 'A',
          20: 'B',
          40: 'C',
          60: 'D',
          80: 'E',
          100: 'F',
        }}
      />
    </Form.Item> */}

    {/* <Form.Item name="radio-group" label="Radio.Group">
      <Radio.Group>
        <Radio value="a">item 1</Radio>
        <Radio value="b">item 2</Radio>
        <Radio value="c">item 3</Radio>
      </Radio.Group>
    </Form.Item> */}


    {/* <Form.Item name="rate" label="Rate">
      <Rate />
    </Form.Item> */}

    <div>
    <Form.Item label="Dragger">
      <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
        <Upload.Dragger name="files" action="/upload.do">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
        </Upload.Dragger>
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
      <TextArea rows={4} onResize={true} placeholder='Hey new here....'/>
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
  </section>
);
export default Profileform;