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

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: undefined
    }
    this.onFinish = this.onFinish.bind(this);
  }

  onFinish = (values) => {
    const id = window.location.pathname.split('/')[2];
    console.log('Received values of form: ', values);
    const { confirm, ...data } = values;
    fetch(`http://localhost:3030/TCS/listings/${id}`, {
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
      alert("Listing Updates")
    })
    
    .catch(errorResponse => {
      console.error(errorResponse);
      alert(`Error: ${errorResponse}`);
    });  
  };
  
  deleteListing = () => {
    const id = window.location.pathname.split('/')[2];
    if(window.confirm('Are you sure?')) {
      fetch(`http://localhost:3030/TCS/listings/${id}` , {
        method: "DELETE",
        header:{'Accept':'application/json',
        'Content-Type':'application/json'
      }
      })
    } else {
      // cancel clicked
    }
  }

  render() {
    return (
      <Form {...formItemLayout} name="Finalize" onFinish={this.onFinish} scrollToFirstError>
      
        <Form.Item name="title" label="Listing Title" >     
          <Input />      
        </Form.Item>
      
        <Form.Item name="breed" label="Dog Breed" >     
          <Input />     
        </Form.Item>
      
        <Form.Item {...formSummaryLayout} name="summary" label="Summary" >      
          <Input />      
        </Form.Item>
      
        <Form.Item name="imageURL" label="Image URL?" >      
          <Input />
        </Form.Item>
      
        <Form.Item {...tailFormItemLayout}>     
          <Button type="primary" htmlType="submit">     
            Publish    
          </Button> 
          <Button type="primary" htmlType="submit" onClick={()=>this.deleteListing()} danger >     
            Delete Listing  
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
