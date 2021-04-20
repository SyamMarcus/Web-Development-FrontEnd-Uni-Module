import React from 'react';
import { Redirect } from 'react-router-dom';
import { PageHeader, Form, Input, Button, message } from 'antd';
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';

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

  componentDidMount() {
    const id = window.location.pathname.split('/')[2];
    fetch(`http://localhost:3030/TCS/listings/${id}`)
    .then(status)
    .then(json)
    .then(post => {
      console.log(post)
      this.setState({post:post})
    })
    .catch(err => {
      console.log(`Fetch error for post ${id}`)
    });
  }

  onFinish = (values) => {
    const username = this.context.user.username;
    const password = this.context.user.password;
    const id = window.location.pathname.split('/')[2];
    console.log('Received values of form: ', values);
    const { confirm, ...data } = values;
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
        console.log(data);
        message.success("Listing Published.");
          
        const url = '/post/' + data.ID;
        this.setState({ redirect: url });
      })
      .catch(errorResponse => {
        console.error(errorResponse);
      });  
    } 
  };
  
  deleteListing = () => {
    const id = window.location.pathname.split('/')[2];
    const username = this.context.user.username;
    const password = this.context.user.password;
    console.log(username + ":" + password);
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
        console.log(data);
        message.success('Listing Deleted');
  
        const url = '/';
        this.setState({ redirect: url });
      })
      .catch(err => {
        console.log(err)
        message.error('Failed to delete');
      });   
    }
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    
    if (!this.state.post) {
      return <h3>Loading post...</h3>
    }
    const post = this.state.post;

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
              <Button type="primary" htmlType="submit" >     
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
