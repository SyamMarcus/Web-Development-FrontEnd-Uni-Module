import { Layout } from 'antd';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Nav from './components/nav';
import Account from './components/account';
import Home from './components/home';
import Post from './components/post';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Router>
        <Header>
          <Nav />
        </Header>
        
        <Content>
          <Switch>
            <Route path="/account" children={<Account />} />
            <Route path="/post/:id" children={<Post />} />
            <Route path="/" children={<Home />} exact />
          </Switch>
        </Content>

        <Footer style={{ textAlign: 'center' }}>The Canine Shelter</Footer>
      </Router>
    </Layout>
  );
}

export default App;
