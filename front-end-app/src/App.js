import React from 'react';
import { Layout } from 'antd';
import './App.css';
import UserContext from './contexts/user';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

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


const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);  
    this.state = {
      user: {
        loggedIn: false,
      }
    }
    
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  login(user) {
    console.log("User is now being set on the context");
    user.loggedIn = true;
    this.setState({user:user});
  }

  logout() {
    console.log("Removing user from the app context");
    this.setState({user: {loggedIn:false}});
  }

  render() {
    
    const context = {
      user: this.state.user,
      login: this.login,
      logout: this.logout
      };

    return (
      
      <Layout className="layout">
        <UserContext.Provider value={context}>
          <Router>
          <Sider 
            trigger={null} 
            collapsible collapsed={this.state.collapsed}
            style={{
            overflow: 'auto',
            width: '50px',
            height: '100vh',
            left: 0,}} >
            <Nav/>
          </Sider>
          
          <Layout className="site-layout" >
            <Header className="site-layout-background" style={{ paddingLeft:20, position:'relative' , color: 'whitesmoke' , fontSize: '24px' }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </Header>
              <Content
                  style={{
                    margin: '0px 24px',
                    padding: 24,
                    minHeight: 280,
                  }}>
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

              <Footer style={{ textAlign: 'center' }}>The Canine Shelter ©2021 Created for 6003CEM</Footer>
            </Layout>
          </Router>
        </UserContext.Provider>
      </Layout>
    );
  }
}

export default App;
