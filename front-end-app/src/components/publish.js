import React from 'react';
import { Form, Input, Button } from 'antd';

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const formSummaryLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, vm: { span: 12 }  }
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

const validateMessages = {
  // eslint-disable-next-line
  required: '${label} is required!',
  types: {
    // eslint-disable-next-line
    title: '${label} is not a valid title!',
    // eslint-disable-next-line
    breed: '${label} is not a valid breed!'
  }
};

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: undefined
    }
    this.onFinish = this.onFinish.bind(this);
  }

  onFinish = (values) => {
    console.log('Received values of form: ', values);
    const { confirm, ...data } = values;
    if(window.confirm('Confirm Creation?')) {
      fetch('http://localhost:3030/TCS/listings', {
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
        alert("Listing published")
      })
      
      .catch(errorResponse => {
        console.error(errorResponse);
        alert(`Error: ${errorResponse}`);
      });  
    };
  }

  render() {
    return (
      <Form {...formItemLayout} name="publish" onFinish={this.onFinish} validateMessages={validateMessages} scrollToFirstError>
      
        <Form.Item name="title" label="Listing Title" rules={[{ required: true }]}>     
          <Input placeholder="title"/>      
        </Form.Item>
      
        <Form.Item name="breed" label="Dog Breed" rules={[{ required: true }]}>     
          <Input />   
        </Form.Item>
      
        <Form.Item {...formSummaryLayout} name="summary" label="Summary" >      
          <Input.TextArea placeholder="summary"/>   
        </Form.Item>
      
        <Form.Item name="imageURL" label="Image URL?" >      
          <Input placeholder="imageURL"/>
        </Form.Item>
      
        <Form.Item {...tailFormItemLayout}>     
          <Button type="primary" htmlType="submit">     
            Publish    
          </Button>    
        </Form.Item >
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

export default RegistrationForm;
