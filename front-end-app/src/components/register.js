import React from 'react';
import { Row, Col, PageHeader, Form, Input, Button, Upload, message, Image } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { UploadOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

const emailRules = [
  {type: 'email', message: 'The input is not valid E-mail!'},
  {required: true, message: 'Please input your E-mail!' }
];  

const passwordRules = [  
  { required: true, message: 'Please input your password!' }
];  
  
const confirmRules = [  
  { required: true, message: 'Please confirm your password!' },
  
  ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject('The passwords that you entered do not match!');
    }
  })
];
  
const userNameRules = [  
  { required: true, message: 'Please input your username!', whitespace: true }
];

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: undefined,
      fileList: [],
      uploading: false,
    }
    this.onFinish = this.onFinish.bind(this);
  }

  onFinish = (values) => {
    console.log('Received values of form: ', values);
    fetch('http://localhost:3030/TCS/register/search?code=' + values.employeeCode)
    .then(status)
    .then(json)
    .then(code => {
      console.log(Object.values(code)[0])
      if(Object.values(code)[0] === 1) {
        values.role = 'admin';
      } else {
        values.role = 'user';
      }
      delete values.employeeCode;
      const { confirm, ...data } = values;
      return fetch('http://localhost:3030/TCS/register/', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(status)
      .then(json)
      .then(data => {
        console.log(data);
        alert("User added")
      })

      .catch(errorResponse => {
        console.error(errorResponse);
        alert(`Error: ${errorResponse}`);
      });  
    })
    .catch(errorResponse => {
      console.error(errorResponse);
      alert(`Error: ${errorResponse}`);
    });  
  };




  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('upload', file);
    });

    this.setState({
      uploading: true,
    });

    fetch('http://localhost:3030/TCS/listings/images', {
      method: "POST",
      body: formData,
    })
    .then(status)
    .then(json)
    .then(data => {
      console.log(data);
      this.setState({
        fileList: [],
        uploading: false,
      });
      message.success('upload successfully.');
    })
    .then( )
    .catch(errorResponse => {
      this.setState({
        uploading: false,
      });
      message.error('upload failed.');
      console.error(errorResponse);
      alert(`Error: ${errorResponse}`);
    });  
  };


  render() {

    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },

      beforeUpload: file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          return message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          return message.error('Image must smaller than 2MB!');
        }

        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
      },
      fileList,
    };

    return (
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%' }}>
          <PageHeader className="site-page-header"
            title="Register Page"
            subTitle="This is where you can register a new account."/>
        </div>  
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
        <Image
            width={200}
            src="http://localhost:3030/TCS/listings/images/c3d4c5ab-56f4-48a6-9ae4-1eb2848df670"
          />
        <Form {...formItemLayout} name="register" onFinish={this.onFinish} scrollToFirstError>
          <Form.Item style={{ marginBottom: 10 }} label="Employee Code" 
            extra="To create an employee account enter a valid employee account code">
            <Row gutter={8}>
              <Col span={6}>
                <Form.Item
                    name="employeeCode"
                    noStyle
                  >
                  <Input placeholder="(optional)" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          
          <Form.Item name="email" label="E-mail" rules={emailRules}>     
            <Input placeholder="account@mail.com"/>      
          </Form.Item>

          <Form.Item name="userName" label="Username" rules={userNameRules}>      
            <Input placeholder="Username"/>
          </Form.Item>

          <Form.Item label="Full Name" style={{ marginBottom: 0 }}>
            <Form.Item
              name="firstName"
              style={{ display: 'inline-block', width: 'calc(40% - 2px)' }}
            >
              <Input placeholder="First name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              style={{ display: 'inline-block', width: 'calc(60% - 2px)', margin: '0 2px' }}
            >
              <Input placeholder="Last name" />
            </Form.Item>
          </Form.Item>
          
          <Form.Item name="password" label="Password" hasFeedback rules={passwordRules}>     
            <Input.Password placeholder="Password"/>     
          </Form.Item>
        
          <Form.Item name="confirm" label="Confirm Password" rules={confirmRules}>      
            <Input.Password placeholder="Confirm Password"/>      
          </Form.Item>
        
          <Form.Item {...tailFormItemLayout}>     
            <Button type="primary" htmlType="submit">     
              Register     
            </Button>    
          </Form.Item >
        </Form>     
      </div>
    );
  };
};


export default RegistrationForm;
