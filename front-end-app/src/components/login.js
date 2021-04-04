import React from 'react';
import { Form, Input, Button } from 'antd';
import UserContext from '../contexts/user';

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

const passwordRules = [
  { required: true, message: 'Please input your password!' }
];

const usernameRules = [
  { required: true, message: 'Please input your username!', whitespace: true }
]


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
      console.log(user);
      this.context.login(user);
    })
    .catch(errorResponse => {
      console.error(errorResponse);
      alert(`Error: ${errorResponse}`);
    });  
  };

  render() {
    return (
      <Form {...formItemLayout} name="login" onFinish={this.login} scrollToFirstError >
        <Form.Item name="username" label="Username" rules={usernameRules} >
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={passwordRules} hasFeedback >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    );
  };    
};

function status(response) {

  if (response.status >= 200 && response.status < 300) {
    console.log("status err")
    return response;
  } else {
    return new Promise((resolve, reject) => {
      return reject(response);
    });
  }
}

function json(response) {
  return response.json();
}

export default LoginForm;