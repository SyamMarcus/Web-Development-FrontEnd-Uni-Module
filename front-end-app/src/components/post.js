import React from 'react'; 
import { withRouter } from 'react-router';
import { Link } from "react-router-dom";
import { Image, Row, Col, Typography, Button } from 'antd'
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';

const { Title, Paragraph } = Typography;

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
    const post = this.state.post;

    if (this.context.user.ID === this.state.post.authorID) {
      return (
        <div>
          <Row type="flex" justify="space-around" align="middle">
            <Col span={6} align="center">
              <Image width={200} alt="Listing Image" src={post.imageURL} />
            </Col>
            <Col span={12}>
              <Title>{post.title}</Title>
              <Paragraph>{post.breed}</Paragraph>
              <Paragraph>{post.summary}</Paragraph>
              <Button type="primary"><Link to={'/editpost/' + this.state.post.ID}>Edit Post</Link></Button>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
      <Row type="flex" justify="space-around" align="middle">
        <Col span={6} align="center">
          <Image width={200} alt="Listing Image" src={post.imageURL} />
        </Col>
        <Col span={12}>
          <Title>{post.title}</Title>
          <Paragraph>{post.breed}</Paragraph>
          <Paragraph>{post.summary}</Paragraph>
        </Col>
      </Row>
    </div>
    );
  }
}


export default withRouter(Post);
