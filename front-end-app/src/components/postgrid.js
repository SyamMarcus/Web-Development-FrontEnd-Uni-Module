/* eslint-disable no-unreachable */
import React from 'react'; 
import url from '../config';
import { withRouter } from 'react-router';
import { Card, Row, Col, Button, Input, Image, message } from 'antd';
import { Link } from "react-router-dom";
import { status, json } from '../utilities/requestHandlers';
import {
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

const { Search } = Input;
const { Meta } = Card;
const pageLimit = 4;
let pageNum = 1;

/**
 * React component for showing a grid of posted listing.
 * @component
 */
class PostGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** The state prop stores:
      * @array postgrid - an array of post objects
      */
      postgrid: undefined
    }
  }

  /**
  * function to GET a HTTP request for paginated posts to be set in the postgrid when component is exported
  */
  componentDidMount() {
    console.log(url)
    fetch( url + `/TCS/listings/?limit=` + pageLimit + `&page=` + pageNum)
    .then(status)
    .then(json)
    .then(postgrid => {
      this.setState({postgrid:postgrid})
    })
  }

  /**
  * function to GET a HTTP request for paginated posts to be set in the postgrid when the current page is increased
  */
  forward() {
    pageNum ++;
    fetch( url + `/TCS/listings/?limit=` + pageLimit + `&page=` + pageNum)
    .then(json)
    .then(postgrid => {
      this.setState({postgrid:postgrid})
    })
    .catch(err => {
      pageNum --;
    });
  }

  /**
  * function to GET a HTTP request for paginated posts to be set in the postgrid when the current page is decreased
  */
  back() {
    if(pageNum > 1 ) { 
      pageNum --; 
    }
    fetch( url + `/TCS/listings/?limit=` + pageLimit + `&page=` + pageNum)
    .then(status)
    .then(json)
    .then(postgrid => {
      this.setState({postgrid:postgrid})
    })
  }

  /**
  * function to GET a HTTP request for searched for posts to be set in the postgrid when the a search query is passed
  * @param {string} value the search query from the antd input object
  */
  onSearch = (value) => {
    fetch( url + `/TCS/listings/search?q=` + value + `&limit=` + pageLimit + `&page=` + pageNum)
    .then(status)
    .then(json)
    .then(postgrid => {
      this.setState({postgrid:postgrid})
    })
    .catch(err => {
      message.error('No listing found matching search!')
    });
  }

  /**
  * function to render the home page export in JSX
  * @return JSX code to display UI
  */
  render() {
    if (!this.state.postgrid) {
      return <h3>Loading posts...</h3>
    }
    const postgrid = this.state.postgrid;
    const final = [];

    var i;
    for (i = 0; i < postgrid.length; i++) { 
      const altImage = url + "/TCS/images/32886caa-6ab2-41ad-9257-b1602a110ebd"
      const image = postgrid[i].imageURL
      const postURL = '/post/' + postgrid[i].ID;
        final.push(
          <Col span={5}>
            <Link to={postURL}>
              <Card cover={<Image alt="Listing Image" fallback={altImage} src={image}/>}>
                <Meta title={postgrid[i].title} description={postgrid[i].breed} />
              </Card>
            </Link>
          </Col>
        );
      }

    return (
      <>
        <Row justify="center" style={{ padding: '2%', paddingTop: '1%'}}> 
          <Search placeholder="search for listing title"
            allowClear
            enterButton="Search"
            size="medium"
            style={{ padding: '2% 25%', paddingTop: '0%'}}
            onSearch={this.onSearch}/>
          <Button icon={<LeftOutlined style={{ fontSize: "18px" }}/>} type="default" htmlType="submit" onClick={()=>this.back()}/>     
            <p style={{ margin: '10px', marginTop: '5px' }}> Page: {pageNum}</p>
          <Button icon={<RightOutlined style={{ fontSize: "18px" }}/>} type="default" htmlType="submit" onClick={()=>this.forward()}/>    
        </Row>
        <Row type="flex" justify="space-around">
          {final}
        </Row> 
      </>
    );
  }
}

export default withRouter(PostGrid);
