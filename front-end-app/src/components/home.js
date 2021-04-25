import PostGrid from './postgrid';

/**
* function to render the home page export in JSX
* @return JSX code to display UI
*/
function Home() {
  return (
    <>
      <div className="site-layout-content">
        <PostGrid />
      </div>
    </>  
  );
}

export default Home;
