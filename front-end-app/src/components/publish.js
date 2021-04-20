import React from 'react';
import { Redirect } from 'react-router-dom';
import { PageHeader, Form, Input, Button, Upload, message } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { UploadOutlined } from '@ant-design/icons';
import UserContext from '../contexts/user';

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
      redirect: null,
      fileList: [],
    }
    this.onFinish = this.onFinish.bind(this);
  }

  static contextType = UserContext;


  onFinish = (values) => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('upload', file);
    });
    console.log(formData);
    fetch('http://localhost:3030/TCS/images', {
      method: "POST",
      body: formData,
    })
    .then(status)
    .then(json)
    .then(response => {
            
      values.imageURL = response.file.path;
      values.authorID = this.context.user.ID;

      console.log('Form: ', values);
      const { confirm, ...data } = values;
      const username = this.context.user.username;
      const password = this.context.user.password;
      if(window.confirm('Confirm Creation?')) {
        fetch('http://localhost:3030/TCS/listings', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Authorization": "Basic " + btoa(username + ":" + password),
            "Content-Type": "application/json"
          }
        })
        
        .then(status)
        .then(json)
        .then(data => {
          console.log(data);      
          message.success("Listing Published.");
          
          const url = '/post/' + data.ID;
          this.setState({ redirect: url });
        })
        
        .catch(errorResponse => {
          console.error(errorResponse);
          alert(`Error: ${errorResponse}`);
        });  
      };
    })
    .catch(errorResponse => {
      message.error('upload failed.');
      console.error(errorResponse);
      alert(`Error: ${errorResponse}`);
    });  
  };

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    
    const user = this.context.user;

    if(user.loggedIn === false) {
      return (
        <div className="site-layout-content">
          <div style={{ padding: '2% 25%', paddingTop: '0%', }}>
            <PageHeader className="site-page-header"
              title="Publish Listing"
              subTitle="This is where you can publish a new dog listing."/> 
          </div> 
            <p>Please Login with an employee account to publish a dog listing.</p>
        </div>
      );
    }

    if (user.role !== 'admin') {
      return (
        <div className="site-layout-content">
          <div style={{ padding: '2% 25%', paddingTop: '0%', }}>
            <PageHeader className="site-page-header"
              title="Publish Listing"
              subTitle="This is where you can publish a new dog listing."/> 
          </div>
            <p>You must be logged in as an employee to publish a listing.
              You are currently logged in as a basic user. 
              View account page for more info.</p>
        </div>
      );
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
            title="Publish Listing"
            subTitle="This is where you can publish a new dog listing."/>
            </div>  
        <Form {...formItemLayout} name="publish" onFinish={this.onFinish} validateMessages={validateMessages} scrollToFirstError>
        
          <Form.Item name="imageURL" label="Listing Image" rules={[{ required: true, message: 'Please upload an image file!' }]}>     
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button >
            </Upload>
          </Form.Item>

          <Form.Item name="title" label="Listing Title" rules={[{ required: true }]}>     
            <Input placeholder="title"/>      
          </Form.Item>
        
          <Form.Item name="breed" label="Dog Breed" rules={[{ required: true }]}>     
            <Input />   
          </Form.Item>
        
          <Form.Item {...formSummaryLayout} name="summary" label="Summary" >      
            <Input.TextArea placeholder="summary"/>   
          </Form.Item>
        
          <Form.Item {...tailFormItemLayout}>     
            <Button type="primary" htmlType="submit">     
              Publish    
            </Button>    
          </Form.Item >
        </Form>     
      </div>
    );
  };
};


export default RegistrationForm;
