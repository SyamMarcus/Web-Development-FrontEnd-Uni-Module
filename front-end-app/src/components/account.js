import React from 'react';
import url from '../config';
import { Link } from "react-router-dom";
import { Card, PageHeader, Row, Col, Image, Typography} from 'antd';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';

const { Title, Paragraph, Text } = Typography;


const { Meta } = Card;

/**
 * React component for showing a Account details.
 * @component
 */
class Account extends React.Component {
  constructor(props) {
    super(props);
    /** The state prop stores:
     * @object posts - an array of objects to store posts
     */
    this.state = {
      posts: undefined,
    }
  }

  static contextType = UserContext;

  /**
  * function to GET a HTTP request for all user account posts when component is exported
  */
  componentDidMount() {
    const username = this.context.user.username;
    const password = this.context.user.password;
    // const id = this.context.user.ID;
    fetch( url + `/TCS/listings/account`, {
      headers: {
        "Authorization": "Basic " + btoa(username + ":" + password),
      }
    })
    .then(status)
    .then(json)
    .then(posts => {
      this.setState({posts: posts})
    })
  }

  /**
  * function to render the component in JSX
  * @return JSX code to display UI
  */
  render() {
  
  const user = this.context.user;
  if(user.loggedIn === false) {
    return (
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%', paddingTop: '0%', }}>
          <PageHeader className="site-page-header"
            title="Account page"
            subTitle="This is where you can edit account settings."/>
        </div>  
          <p>Please Login with an account to view account details.</p>
      </div>
    );
  }

  let roleInfo = null
  if(user.firstName === null) { user.firstName = 'NOT_PROVIDED'}
  if(user.lastName === null) { user.lastName = 'NOT_PROVIDED'}
  if(user.role === 'user') {
    roleInfo = 'As a basic user, you are able to search for, and view all active listings from the home page. ' +
    'To gain access to other functions such as publishing new listings, you need to register as an employee user.'
  } 
  if(user.role === 'admin') {
    roleInfo = 'As an employee user, you are able to publish new dog listings which can be viewed on the home page. ' +
    'The listings you have published can also be edited and deleted. These listings can be accessed from the home ' +
    'page and your account details page. You can also search for, and view all active listings from the home page'
  }
  user.dateRegistered = user.dateRegistered.split("T")[0];

  const altImage =  url + "/TCS/images/32886caa-6ab2-41ad-9257-b1602a110ebd"
  const image = user.avatarURL

  if (!this.state.posts) {
    return (
      <>
        <div className="site-layout-content">
          <Row type="flex" justify="space-around" align="middle">
            <Col span={6} align="center">
              <Col><Title level={4}>Avatar:</Title></Col>
              <Image width={250} alt="Listing Image" fallback={altImage} src={image} />
            </Col>
            <Col span={16}>
              <Title level={2}>Account Information: </Title>
                <Paragraph><Text strong >Username: </Text><Text>{user.username}</Text></Paragraph>
                <Paragraph><Text strong >Role: </Text><Text>{user.role}</Text></Paragraph>
                <Paragraph>
                  <Text strong >First Name: </Text><Text>{user.firstName}, </Text>
                  <Text strong >Last Name: </Text><Text>{user.lastName} </Text>
                </Paragraph>
                <Paragraph><Text strong >Email Address: </Text><Text>{user.email}</Text></Paragraph>
                <Paragraph><Text strong >Date Registered: </Text><Text>{user.dateRegistered}</Text></Paragraph>
                <Paragraph type="secondary">{roleInfo}</Paragraph>
            </Col>          
          </Row>
  
          <Title style={{ paddingTop: '5%', paddingLeft: '5%'}} level={3}>Your Active Listings: </Title>
          <Row type="flex" justify="space-around" >
            You have not published any active listings yet!
          </Row> 
        </div>
      </>
    );
  } else {
    const posts = this.state.posts;
    const final = [];
    var i;
    for (i = 0; i < posts.length; i++) { 
      const altImage =  url + "/TCS/images/32886caa-6ab2-41ad-9257-b1602a110ebd"
      const image = posts[i].imageURL
      const imageUrl = '/post/' + posts[i].ID;
        final.push(
          <Col span={5} style={{ marginBottom: '40px' }}>
            <Link to={imageUrl}>
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
          <Row type="flex" justify="space-around" align="middle">
            <Col span={6} align="center">
              <Col><Title level={4}>Avatar:</Title></Col>
              <Image width={250} alt="Listing Image" fallback={altImage} src={image} />
            </Col>
            <Col span={16}>
              <Title level={2}>Account Information: </Title>
                <Paragraph><Text strong >Username: </Text><Text>{user.username}</Text></Paragraph>
                <Paragraph><Text strong >Role: </Text><Text>{user.role}</Text></Paragraph>
                <Paragraph>
                  <Text strong >First Name: </Text><Text>{user.firstName}, </Text>
                  <Text strong >Last Name: </Text><Text>{user.lastName} </Text>
                </Paragraph>
                <Paragraph><Text strong >Email Address: </Text><Text>{user.email}</Text></Paragraph>
                <Paragraph><Text strong >Date Registered: </Text><Text>{user.dateRegistered}</Text></Paragraph>
                <Paragraph type="secondary">{roleInfo}</Paragraph>
            </Col>          
          </Row>
  
          <Title style={{ paddingTop: '5%', paddingLeft: '5%'}} level={3}>Your Active Listings: </Title>
          <Row type="flex" justify="space-around" >
            {final}
          </Row> 
        </div>
        </>
      );  
    }
  };
};

export default Account;