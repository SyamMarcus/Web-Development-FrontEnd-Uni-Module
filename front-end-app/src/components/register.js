import React from 'react';
import { Form, Input, Button } from 'antd';

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
  
const usernameRules = [  
  { required: true, message: 'Please input your username!', whitespace: true }
];

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: undefined
    }
    this.onFinish = this.onFinish.bind(this);
  }

  onFinish(x) {
    console.log(x);
  };

  render() {
    return (
      <Form {...formItemLayout} name="register" onFinish={this.onFinish} scrollToFirstError>
      
        <Form.Item name="email" label="E-mail" rules={emailRules}>     
          <Input />      
        </Form.Item>
      
        <Form.Item name="password" label="Password" hasFeedback rules={passwordRules}>     
          <Input.Password />     
        </Form.Item>
      
        <Form.Item name="confirm" label="Confirm Password" rules={confirmRules}>      
          <Input.Password />      
        </Form.Item>
      
        <Form.Item name="userName" label="Username" rules={usernameRules}>      
          <Input />
        </Form.Item>
      
        <Form.Item {...tailFormItemLayout}>     
          <Button type="primary" htmlType="submit">     
            Register     
          </Button>    
        </Form.Item >
      </Form>     
    );
  };
};

export default RegistrationForm;
