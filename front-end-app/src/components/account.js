import React from 'react';
import { Link } from "react-router-dom";
import { Card, PageHeader, Row, Col, Image } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';


const { Meta } = Card;


class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: undefined,
    }
  }

  static contextType = UserContext;

  componentDidMount() {
    const id = this.context.user.ID;
    fetch(`http://localhost:3030/TCS/listings/account/${id}`)
    .then(status)
    .then(json)
    .then(posts => {
      console.log(posts)
      this.setState({posts: posts})
    })
    .catch(err => {
      console.log(`Fetch error for post by authorID: ${id}`)
    });
  }


 render() {
  
  const user = this.context.user;
  if(user.loggedIn === false) {
    return (
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%' }}>
          <PageHeader className="site-page-header"
            title="Account page"
            subTitle="This is where you can edit account settings."/>
        </div>  
          <p>Please Login with an account to view account details.</p>
      </div>
    );
  }

  if (!this.state.posts) {
    return <h3>Loading Account Details...</h3>
  }

  const posts = this.state.posts;
  const final = [];
  var i;
  for (i = 0; i < posts.length; i++) { 
    const altImage = "http://localhost:3030/TCS/listings/images/32886caa-6ab2-41ad-9257-b1602a110ebd"
    const image = "http://localhost:3030" + posts[i].imageURL
    const postURL = '/post/' + posts[i].ID;
      final.push(
        <Col span={5} style={{ marginBottom: '40px' }}>
          <Link to={postURL}>
            <Card cover={<Image alt="Listing Image" fallback={altImage} src={image}/>}>
              <Meta title={posts[i].title} description={posts[i].breed} />
            </Card>
          </Link>
        </Col>
      );
    }

  return (
    <>
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%' }}>
          <PageHeader className="site-page-header"
            title="Account page"
            subTitle="This is where you can edit account settings."/>
        </div>  
        <h> You're Listngs: </h>
        <Row type="flex" justify="space-around" >
          {final}
        </Row> 
      </div>
      </>
    );  
  };
};

export default Account;