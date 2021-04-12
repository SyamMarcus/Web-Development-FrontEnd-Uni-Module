import React from 'react';
import { Space, PageHeader, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';


const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }
  
  static contextType = UserContext;

  login(values){
    const {username, password} = values;
    console.log(`logging in user: ${username}`)
    fetch('http://localhost:3030/TCS/register/login', {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(username + ":" + password)
      }
    })
    .then(status)
    .then(json)
    .then(user => {
      alert("User Logged In")
      this.context.login(user);
    })
    .catch(errorResponse => {
      console.error(errorResponse);
      alert(`Error: ${errorResponse}`);
    });  
  };

  render() {
    return (
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%' }}>
          <PageHeader className="site-page-header"
            title="Login Page"
            subTitle="This is where you can login."/>
        </div>  
    
        <Form {...formItemLayout}
          name="normal_login"
          className="login-form"
          scrollToFirstError
          initialValues={{ remember: true }}
          onFinish={this.login}
        >
          <Form.Item 
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          
          <Form.Item {...tailFormItemLayout}>
          <Space size={'small'}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in 
            </Button>
            <Space size={'small'}>
              Or <a href="/register">register now!</a>
            </Space>
          </Space>
          </Form.Item>
        </Form>
      </div>
    );
  };
};

export default LoginForm;