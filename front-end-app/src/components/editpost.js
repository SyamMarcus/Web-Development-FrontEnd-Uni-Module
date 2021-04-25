import React from 'react';
import { Redirect } from 'react-router-dom';
import { PageHeader, Form, Input, Button, Upload, message, Image, Space, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';

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
 * React component for showing a form to edit a posted listing.
 * @component
 */
class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    /** The state prop stores:
    * @object post - an object to store post information
    * @string imageURL - a string for the location of the submitted image
    * @string redirect - a link to redirect to when rendering
    * @array fileList - an array of objects to store files uploaded through the antd upload component
    */
    this.state = {
      imageURL: null,
      post: undefined,
      redirect: null,
      fileList: [],
    }
    this.onFinish = this.onFinish.bind(this);
  }

  static contextType = UserContext;

  /**
  * function to GET a HTTP request for the current post when component is exported
  */
  componentDidMount() {
    const id = window.location.pathname.split('/')[2];
    fetch(`http://localhost:3030/TCS/listings/${id}`)
    .then(status)
    .then(json)
    .then(post => {
      this.setState({
        post: post,
        imageURL: post.imageURL
      })
    })
  }

  /**
  * function to make a PUT HTTP request to update the current post with form information when submitted
  * @param {object} values the listing information from the antd Form  
  */
  onFinish = (values) => {
    if(this.state.fileList.length !== 0) {

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
      .then(response => {
              
        values.imageURL = "http://localhost:3030" + response.file.path;
        values.authorID = this.context.user.ID;
  
        console.log('Form: ', values);
        const { confirm, ...data } = values;
        const username = this.context.user.username;
        const password = this.context.user.password;
        const id = window.location.pathname.split('/')[2];
        if(window.confirm('Save Listing Changes?')) {
          fetch(`http://localhost:3030/TCS/listings/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Authorization": "Basic " + btoa(username + ":" + password),
              "Content-Type": "application/json"
            }
          })
          .then(status)
          .then(json)
          .then(data => {
            message.success("Listing Updated.");
              
            const url = '/post/' + data.ID;
            this.setState({ redirect: url });
          })
        };
      })
      .catch(errorResponse => {
        message.error('Update failed.');
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
      const id = window.location.pathname.split('/')[2];
      if(window.confirm('Save Listing Changes?')) {
        fetch(`http://localhost:3030/TCS/listings/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Authorization": "Basic " + btoa(username + ":" + password),
            "Content-Type": "application/json"
          }
        })
        .then(status)
        .then(json)
        .then(data => {
          message.success("Listing Updated.");
            
          const url = '/post/' + data.ID;
          this.setState({ redirect: url });
        })
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
  * function to make a DELETE HTTP request to delete the current post
  */
  deleteListing = () => {
    const id = window.location.pathname.split('/')[2];
    const username = this.context.user.username;
    const password = this.context.user.password;
    if(window.confirm('Delete Listing?')) {
      fetch(`http://localhost:3030/TCS/listings/${id}` , {
        method: "DELETE",
        headers: {
          "Authorization": "Basic " + btoa(username + ":" + password),
        }
      })
      .then(status)
      .then(json)
      .then(data => {
        message.success('Listing Deleted');
  
        const url = '/';
        this.setState({ redirect: url });
      })
      .catch(err => {
        message.error('Failed to delete listing');
      });   
    }
  }

  /**
  * function to render the component in JSX
  * @return JSX code to display UI
  */
  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    
    if (!this.state.post) {
      return <h3>Loading post...</h3>
    }
    const post = this.state.post;

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

    if (this.context.user.ID === this.state.post.authorID) {
      return (
        <div className="site-layout-content">
          <div style={{ padding: '2% 25%', paddingTop: '0%', }}>
            <PageHeader className="site-page-header"
              title="Edit the post below"
              subTitle="This is where you can update this post."/>
            </div>  
            
          <Form {...formItemLayout} name="Finalize" onFinish={this.onFinish} validateMessages={validateMessages} scrollToFirstError
            initialValues={{
              title: post.title,
              breed: post.breed,
              summary: post.summary,
            }}
          >
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
              <Input />      
            </Form.Item>
            
            <Form.Item name="breed" label="Dog Breed" rules={[{ required: true }]}>     
              <Input />   
            </Form.Item>
          
            <Form.Item {...formSummaryLayout} name="summary" label="Summary" >      
              <Input.TextArea /> 
            </Form.Item>
          
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" disabled={imageExists}>     
                Finalize   
              </Button> 
              <Button type="primary"  style={{ margin: '0 14px' }} onClick={()=>this.deleteListing()} danger >     
                Delete Listing  
              </Button>  
            </Form.Item >
          </Form>     
        </div>
      );
    }    
    return (
      <p>Please login as the author of this listing to edit it</p>
    );
  };
};


export default RegistrationForm;
