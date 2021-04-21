/* eslint-disable no-unreachable */
import React from 'react'; 
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
      this.setState({postgrid:postgrid})
    })
  }

  forward() {
    pageNum ++;
    fetch(`http://localhost:3030/TCS/listings/?limit=` + pageLimit + `&page=` + pageNum)
    .then(json)
    .then(postgrid => {
      this.setState({postgrid:postgrid})
    })
    .catch(err => {
      pageNum --;
    });
  }

  back() {
    if(pageNum > 1 ) { 
      pageNum --; 
    }
    fetch(`http://localhost:3030/TCS/listings/?limit=` + pageLimit + `&page=` + pageNum)
    .then(status)
    .then(json)
    .then(postgrid => {
      this.setState({postgrid:postgrid})
    })
  }

  onSearch = (value) => {
    fetch(`http://localhost:3030/TCS/listings/search?q=` + value + `&limit=` + pageLimit + `&page=` + pageNum)
    .then(status)
    .then(json)
    .then(postgrid => {
      this.setState({postgrid:postgrid})
    })
    .catch(err => {
      message.error('No listing found matching search!')
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
      const altImage = "http://localhost:3030/TCS/images/32886caa-6ab2-41ad-9257-b1602a110ebd"
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
        <Search placeholder="search for listing title"
            allowClear
            enterButton="Search"
            size="medium"
            style={{ padding: '2% 25%', paddingTop: '0%'}}
            onSearch={this.onSearch}/>
        <Row type="flex" justify="space-around">
          {final}
        </Row> 
        <Row justify="center">
          <Button icon={<LeftOutlined style={{ fontSize: "18px" }}/>} type="default" htmlType="submit" onClick={()=>this.back()}/>     
            <p style={{ margin: '10px', marginTop: '5px' }}> Page: {pageNum}</p>
          <Button icon={<RightOutlined style={{ fontSize: "18px" }}/>} type="default" htmlType="submit" onClick={()=>this.forward()}/>     
        </Row>
      </>
    );
  }
}

export default withRouter(PostGrid);
