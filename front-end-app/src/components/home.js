import { PageHeader, Input } from 'antd';
import PostGrid from './postgrid';

const { Search } = Input;

function Home(props) {
  return (
    <>
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%' }}>
          <Search placeholder="input search text"
            allowClear
            enterButton="Search"
            size="medium"
            onSearch={null}/>
          <PageHeader className="site-page-header"
            title="The Canine Shelter"
            subTitle="This is the canine shelter home page."/>
        </div>  
        <PostGrid />
      </div>
    </>  
  );
}

export default Home;
