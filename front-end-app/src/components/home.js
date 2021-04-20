import { PageHeader } from 'antd';
import PostGrid from './postgrid';

function Home(props) {
  return (
    <>
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%', paddingTop: '0%', }}>
          <PageHeader className="site-page-header"
            title="Home Page"
            subTitle="All published listings can be viewed here"/>
        </div>  
        <PostGrid />
      </div>
    </>  
  );
}

export default Home;
