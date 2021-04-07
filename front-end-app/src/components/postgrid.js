/* eslint-disable no-unreachable */
import React from 'react'; 
import { withRouter } from 'react-router';
import { Card, Row, Col, Button } from 'antd';
import { Link } from "react-router-dom";

const { Meta } = Card;
const pageLimit = 4;
let pageMax = 10;
let pageNum = 1;

class PostGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      postgrid: undefined
    }
  }


  componentDidMount() {

    fetch(`http://localhost:3030/TCS/listings/?limit=` + pageLimit + `&page=` + pageNum)
    .then(status)
    .then(json)
    .then(postgrid => {
      console.log(postgrid)
      this.setState({postgrid:postgrid})
    })
    .catch(err => {
      console.log(`Fetch error for post`)
    });
  }

  forward() {
    if(pageNum < pageMax ) { pageNum ++; }
    fetch(`http://localhost:3030/TCS/listings/?limit=` + pageLimit + `&page=` + pageNum)
    .then(status)
    .then(json)
    .then(postgrid => {
      console.log(postgrid)
      this.setState({postgrid:postgrid})
    })
    .catch(err => {
      pageNum --;
      console.log(`Fetch error for post`)
    });
  }

  back() {
    if(pageNum > 1 ) { pageNum --; }
    fetch(`http://localhost:3030/TCS/listings/?limit=` + pageLimit + `&page=` + pageNum)
    .then(status)
    .then(json)
    .then(postgrid => {
      console.log(postgrid)
      this.setState({postgrid:postgrid})
    })
    .catch(err => {
      console.log(`Fetch error for post`)
    });
  }

  render() {
    if (!this.state.postgrid) {
      return <h3>Loading posts...</h3>
    }
    const postgrid = this.state.postgrid;
    const final = [];

    var i;
    for (i = 0; i < postgrid.length; i++) { 
      const postURL = '/post/' + postgrid[i].ID;
      
      /*
      if(i === 0 || i%4 === 0) {
        final.push(
          <Row type="flex" justify="space-around">
            <Col span={4}>
              <Link to={postURL}>
                <Card cover={<img alt={i} src={postgrid[i].imageURL}/>}>
                  <Meta title={postgrid[i].title} description={postgrid[i].breed} />
                </Card>
              </Link>
            </Col> 
          </Row>
        );
      } else { */
        final.push(
          <Col span={4}>
            <Link to={postURL}>
              <Card cover={<img alt={i} src={postgrid[i].imageURL}/>}>
                <Meta title={postgrid[i].title} description={postgrid[i].breed} />
              </Card>
            </Link>
          </Col>
        );
      }

    return (
      <>
        <Row type="flex" justify="space-around">
          {final}
        </Row> 
        <Button type="default" htmlType="submit" onClick={()=>this.back()}>     
          back    
        </Button> 
        <p>{pageNum}</p>
        <Button type="default" htmlType="submit" onClick={()=>this.forward()}>     
          forward   
        </Button> 
      </>
    );

    return (
      <>
      <Row type="flex" justify="space-around">
        <Col span={4}>
          <Link to="/post/1">
            <Card cover={<img alt="one" src={postgrid[0].imageURL}/>}>
              <Meta title={postgrid[0].title} description={postgrid[0].breed} />
            </Card>
          </Link>
        </Col>
        <Col span={4}>
          <Link to="/post/2">
            <Card cover={<img alt="two" src={postgrid[1].imageURL}/>}>
              <Meta title={postgrid[1].title} description={postgrid[1].breed} />
            </Card>
          </Link>
        </Col>
        <Col span={4}>
          <Link to="/post/3">
            <Card cover={<img alt="three" src={postgrid[3].imageURL}/>}>
              <Meta title={postgrid[3].title} description={postgrid[3].breed} />
            </Card>
          </Link>
        </Col>
        <Col span={4}>
          <Link to="/post/4">
            <Card cover={<img alt="four" src="https://picsum.photos/id/1024/400"/>}>
              <Meta title="Fourth Listing" description="Listing Description" />
            </Card>
          </Link>
        </Col>
      </Row>  
      <Row type="flex" justify="space-around">
        <Col span={4}>
          <Link to="/post/5">
            <Card cover={<img alt="five" src="https://picsum.photos/id/1025/400"/>}>
              <Meta title="Fifth Listing" description="Listing Description" />
            </Card>
          </Link>
        </Col>
        <Col span={4}>
          <Link to="/post/6">
            <Card cover={<img alt="six" src="https://picsum.photos/id/1026/400"/>}>
              <Meta title="Sixth Listing" description="Listing Description" />
            </Card>
          </Link>
        </Col>
        <Col span={4}>
          <Link to="/post/7">
            <Card cover={<img alt="seven" src="https://picsum.photos/id/1027/400"/>}>
              <Meta title="Seventh Listing" description="Listing Description" />
            </Card>
          </Link>
        </Col>
        <Col span={4}>
          <Link to="/post/8">
            <Card cover={<img alt="eighth" src="https://picsum.photos/id/1028/400"/>}>
              <Meta title="Eighth Listing" description="Listing Description" />
            </Card>
          </Link>
        </Col>
      </Row>  
      </>
    );
  }
}

function status(response) {

  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return new Promise((resolve, reject) => {
      console.log("status err")
      return reject(response);
    });
  }
}

function json(response) {
  return response.json();
}

export default withRouter(PostGrid);
