import React from 'react';
import url from '../config';
import { Redirect } from 'react-router-dom';
import { PageHeader, Form, Input, Button, Upload, message, Image, Space, Row, Col } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { UploadOutlined } from '@ant-design/icons';
import UserContext from '../contexts/user';

const { Search } = Input;

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

/**
 * React component for showing a listing publication form.
 * @component
 */
class PublicationForm extends React.Component {
  constructor(props) {
    super(props);
    /** The state prop stores:
    * @string imageURL - a string for the location of the submitted image
    * @string redirect - a link to redirect to when rendering
    * @array fileList - an array of objects to store files uploaded through the antd upload component
    */
    this.state = {
      imageURL: null,
      redirect: null,
      fileList: [],
    }
    this.onFinish = this.onFinish.bind(this);
  }

  static contextType = UserContext;

  /**
  * function to make a POST HTTP request to upload a new listing post with form information when submitted
  * @param {object} values the listing information from the antd Form  
  */
  onFinish = (values) => {
    if(this.state.fileList.length !== 0) {

      const { fileList } = this.state;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('upload', file);
      });
      fetch( url + '/TCS/images', {
        method: "POST",
        body: formData,
      })
      .then(status)
      .then(json)
      .then(response => {
              
        values.imageURL = url + response.file.path;
        values.authorID = this.context.user.ID;
  
        console.log('Form: ', values);
        const { confirm, ...data } = values;
        const username = this.context.user.username;
        const password = this.context.user.password;
        if(window.confirm('Confirm Creation?')) {
          fetch( url + '/TCS/listings', {
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
    } else {
      values.imageURL = this.state.imageURL;
      values.authorID = this.context.user.ID;

      console.log('Form: ', values);
      const { confirm, ...data } = values;
      const username = this.context.user.username;
      const password = this.context.user.password;
      if(window.confirm('Confirm Creation?')) {
        fetch( url + '/TCS/listings', {
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
    };
  }

  /**
  * function to make a GET HTTP request to fetch a matching dog image using the antd input value
  * @param {string} value the text inputed by the user to get a image by dog breed
  */
  getDog = value => {
    value = value.toLowerCase().trim()
    fetch(`https://dog.ceo/api/breed/${value}/images/random`)
    .then(status)
    .then(json)
    .then(image => {
      this.setState({
        imageURL: image.message,
        fileList: [],
      })
    })
    .catch(err => {
      message.error('No Breed Matching: ' + value);
    });  
  }

  /**
  * function to reset the imageURL value when changing image upload methods in the form
  */
  changeImage() {
    this.setState({ imageURL: null });
  }

  /**
  * function to render the component in JSX
  * @return JSX code to display UI
  */
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

    let imageExists = true;
    if (this.state.imageURL !== null || (this.state.fileList.length !== 0 && this.state.fileList.length <= 1 )) { 
      imageExists = false; 
    }

    const onSearch = value => this.getDog(value);

    return (
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%', paddingTop: '0%', }}>
          <PageHeader className="site-page-header"
            title="Publish Listing"
            subTitle="This is where you can publish a new dog listing."/>
        </div>  
        <Form {...formItemLayout} name="publish" onFinish={this.onFinish} validateMessages={validateMessages} scrollToFirstError>
        
          <Form.Item name="imageURL" label="Listing Image">    
            <Row gutter={16} > 
              <Col>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />} onClick={()=>this.changeImage()}>Select File for Upload</Button >
                </Upload> 
              </Col>
              <Col>
                <Space size={'middle'}>
                  <Space size={'middle'}>
                    Or 
                  </Space>

                  <Search placeholder="input breed for image"
                    enterButton="Find Image"
                    size="medium"
                    onSearch={onSearch}>
                  </Search>
                </Space>
              </Col>
            </Row>        
            <Row style={{ paddingTop: '3%', }}>
              <Image width={200} preview={false} src={this.state.imageURL} /> 
            </Row>
          </Form.Item>

          <Form.Item name="title" label="Listing Title" rules={[{ required: true }]}>     
            <Input placeholder="title"/>      
          </Form.Item>
        
          <Form.Item name="breed" label="Dog Breed" rules={[{ required: true }]}>     
            <Input placeholder="breed"/>   
          </Form.Item>
        
          <Form.Item {...formSummaryLayout} name="summary" label="Summary" >      
            <Input.TextArea placeholder="summary"/>   
          </Form.Item>
        
          <Form.Item {...tailFormItemLayout}>     
            <Button type="primary" htmlType="submit" disabled={imageExists}>     
              Publish    
            </Button>    
          </Form.Item >
        </Form>   

      </div>
    );
  };
};


export default PublicationForm;
