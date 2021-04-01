import React from 'react';
import { Form, Input, Button } from 'antd';

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

class RegistrationForm extends React.Component {

  render() {
    return (
      <Form {...formItemLayout} name="register">
      
        <Form.Item name="email" label="E-mail">     
          <Input />      
        </Form.Item>
      
        <Form.Item name="password" label="Password">     
          <Input.Password />     
        </Form.Item>
      
        <Form.Item name="confirm" label="Confirm Password">      
          <Input.Password />      
        </Form.Item>
      
        <Form.Item name="username" label="Username">      
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
