import React from 'react'; 
import { withRouter } from 'react-router';
import { Link } from "react-router-dom";
import { Image, Row, Col, Typography, Button } from 'antd'
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';

const { Title, Paragraph, Text } = Typography;

class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: undefined
    }
  }

  static contextType = UserContext;

  componentDidMount() {
    const id = this.props.match.params.id;

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

  render() {
    // if(user.id != post.authorID) { //return without button }
    if (!this.state.post) {
      return <h3>Loading post...</h3>
    }

    const user = this.context.user;
    const post = this.state.post;
    const altImage = "http://localhost:3030/TCS/images/32886caa-6ab2-41ad-9257-b1602a110ebd"
    const image = "http://localhost:3030" + post.imageURL
    post.dateCreated = post.dateCreated.split("T")[0];

    function confirmAuthor() { 
      if(user.ID !== post.authorID) {
        return true;
      } else {
        return false;
      }
    } 

    return (
      <>
        <div>
          <Row type="flex" justify="space-around" align="middle">
            <Col span={6} align="center">
              <Col><Title level={4}>Listing Image:</Title></Col>
              <Image width={300} alt="Listing Image" fallback={altImage} src={image} />
            </Col>
            <Col span={14}>
                <Title level={2}>{post.title}: </Title>
                <Paragraph><Text strong >Dog Breed: </Text><Text>{post.breed}</Text></Paragraph>
                <Paragraph><Text strong >Summary: </Text><Text>{post.summary}</Text></Paragraph>
                <Paragraph><Text strong >Date Created: </Text><Text>{post.dateCreated}</Text></Paragraph>

                <Button disabled={confirmAuthor()} type="primary"><Link to={'/editpost/' + this.state.post.ID}>Edit Post</Link></Button>
            </Col>          
          </Row>
        </div>
      </>
    );
  }
}


export default withRouter(Post);
