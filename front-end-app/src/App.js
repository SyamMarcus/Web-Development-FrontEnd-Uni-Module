import React from 'react';
import { Layout } from 'antd';
import './App.css';
import UserContext from './contexts/user';

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

class App extends React.Component {
  constructor(props) {
    super(props);  
    this.state = {
      user: {loggedIn: false}
    }
    
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

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
        </UserContext.Provider>
      </Layout>
    );
  }
}

export default App;
