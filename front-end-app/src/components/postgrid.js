/* eslint-disable no-unreachable */
import React from 'react'; 
import { withRouter } from 'react-router';
import { Card, Row, Col, Button, Input, Pagination, Image } from 'antd';
import { Link } from "react-router-dom";
import { status, json } from '../utilities/requestHandlers';

const { Search } = Input;
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

  update(pageNumber) {
    console.log(pageNumber);
    fetch(`http://localhost:3030/TCS/listings/?limit=` + pageLimit + `&page=` + pageNumber)
    .then(status)
    .then(json)
    .then(postgrid => {
      console.log(this)
      this.setState({postgrid:postgrid})
      console.log('test')
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

  onSearch = (value) => {
    console.log(value);
    fetch(`http://localhost:3030/TCS/listings/search?q=` + value + `&limit=` + pageLimit + `&page=` + pageNum)
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
      const altImage = "http://localhost:3030/TCS/images/32886caa-6ab2-41ad-9257-b1602a110ebd"
      const image = "http://localhost:3030" + postgrid[i].imageURL
      const postURL = '/post/' + postgrid[i].ID;
        final.push(
          <Col span={pageLimit}>
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
        <Search placeholder="input search text"
            allowClear
            enterButton="Search"
            size="medium"
            onSearch={this.onSearch}/>
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
        <Pagination defaultCurrent={10} total={20}  />

      </>
    );
  }
}

export default withRouter(PostGrid);
