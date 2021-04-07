import { PageHeader } from 'antd';
import PostGrid from './postgrid';

function Home(props) {
  return (
    <>
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%' }}>
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
