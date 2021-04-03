import { Layout } from 'antd';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Nav from './components/nav';
import Account from './components/account';
import Register from './components/register';
import Login from './components/login';
import Home from './components/home';
import Post from './components/post';
import Publish from './components/publish';
import Editpost from './components/editpost';


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
            <Route path="/register" children={<Register />} />
            <Route path="/login" children={<Login />} />
            <Route path="/publish" children={<Publish />} />
            <Route path="/editpost/:id" children={<Editpost />} />
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
