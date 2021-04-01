import React from 'react'; 
import { withRouter } from 'react-router';
import { Image, Row, Col, Typography } from 'antd'

const { Title, Paragraph } = Typography;

class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: undefined
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;

    fetch(`http://localhost:3030/TCS/listings/${id}`)
    .then(status)
    .then(json)
    .then(post => {
      this.setState({post:post})
    })
    .catch(err => {
      console.log(`Fetch error for post ${id}`)
    });
  }

  render() {
    if (!this.state.post) {
      return <h3>Loading post...</h3>
    }
    const post = this.state.post;

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

export default withRouter(Post);
