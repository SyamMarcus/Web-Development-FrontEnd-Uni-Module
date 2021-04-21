import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, PageHeader, Form, Input, Button, Upload, message } from 'antd';
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
      redirect: null,
      fileList: [],
    }
    this.onFinish = this.onFinish.bind(this);
  }

  onFinish = (values) => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('upload', file);
    });
    fetch('http://localhost:3030/TCS/images', {
      method: "POST",
      body: formData,
    })
    .then(status)
    .then(json)
    .then(data => {
      values.avatarURL = "http://localhost:3030" + data.file.path
      
      fetch('http://localhost:3030/TCS/register/search?code=' + values.employeeCode)
      .then(status)
      .then(json)
      .then(code => {

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
          this.setState({
            fileList: [], 
          });
          message.success('Account Created.');

          const url = '/login/';
          this.setState({ redirect: url });
        })
        .catch(err => {
          message.error('Failed to create account.');
        });  
      })
    })

    .catch(errorResponse => {
      message.error('Failed to upload Avatar Image.');
    });  
  };

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { fileList } = this.state;
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
        return false
      },
      fileList,
    };

    return (
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%', paddingTop: '0%', }}>
          <PageHeader className="site-page-header"
            title="Register Page"
            subTitle="This is where you can register a new account."/>
        </div>  
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

          <Form.Item name="avatarURL" label="Avatar Image" rules={[{ required: true, message: 'Please upload an image file!' }]}>     
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button >
            </Upload>
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
            <Button type="primary" htmlType="submit" disabled={fileList.length > 1} >     
              Register     
            </Button>    
          </Form.Item >
        </Form>     
      </div>
    );
  };
};


export default RegistrationForm;
