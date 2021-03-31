import { Card, Row, Col } from 'antd';
const { Meta } = Card;

const grid = (
  <>
  <Row type="flex" justify="space-around">
    <Col span={4}>
      <Card cover={<img alt="one" src="https://picsum.photos/id/1021/400"/>}>
        <Meta title="First Listing" description="Listing Description" />
      </Card>
    </Col>
    <Col span={4}>
      <Card cover={<img alt="two" src="https://picsum.photos/id/1022/400"/>}>
        <Meta title="Second Listing" description="Listing Description" />
      </Card>
    </Col>
    <Col span={4}>
      <Card cover={<img alt="three" src="https://picsum.photos/id/1023/400"/>}>
        <Meta title="Three Listing" description="Listing Description" />
      </Card>
    </Col>
    <Col span={4}>
      <Card cover={<img alt="four" src="https://picsum.photos/id/1024/400"/>}>
        <Meta title="Fourth Listing" description="Listing Description" />
      </Card>
    </Col>
  </Row>  
  <Row type="flex" justify="space-around">
    <Col span={4}>
      <Card cover={<img alt="five" src="https://picsum.photos/id/1025/400"/>}>
        <Meta title="Fifth Listing" description="Listing Description" />
      </Card>
    </Col>
    <Col span={4}>
      <Card cover={<img alt="six" src="https://picsum.photos/id/1026/400"/>}>
        <Meta title="Sixth Listing" description="Listing Description" />
      </Card>
    </Col>
    <Col span={4}>
      <Card cover={<img alt="seven" src="https://picsum.photos/id/1027/400"/>}>
        <Meta title="Seventh Listing" description="Listing Description" />
      </Card>
    </Col>
    <Col span={4}>
      <Card cover={<img alt="eighth" src="https://picsum.photos/id/1028/400"/>}>
        <Meta title="Eighth Listing" description="Listing Description" />
      </Card>
    </Col>
  </Row>  
  </>
);

function PostGrid(props) {
  return grid;
}

export default PostGrid;
