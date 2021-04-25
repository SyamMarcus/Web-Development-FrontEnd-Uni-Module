import React from 'react';
import { Menu } from 'antd';
import { Link } from "react-router-dom";
import UserContext from '../contexts/user';
import { MailOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;


/**
 * React component for the SPA navigation bar
 * @component
 */
class Nav extends React.Component {
  /** The state stores:
  * @boolean collapsed - stores info of the antd nav bar collapsed state
  */
  state = {
    collapsed: false,
  };

  static contextType = UserContext;

  /**
  * function to toggle the nav bar collapsed state
  */
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  /**
  * function to render the home page export in JSX
  * @return JSX code to display UI
  */
  render() {

    const user = this.context.user;

    if(user.loggedIn === false) {
      return (
        <UserContext.Consumer>
          {({logout}) => (
            <>
              <div className="logo" />
              
              <Menu 
                theme="dark" 
                mode="inline" 
                style={{ fontSize: '18px' }} 
                defaultSelectedKeys={['1']}
                inlineCollapsed={this.state.collapsed}
                >
                <Menu.Item key="1" icon={<HomeOutlined style={{ fontSize: "18px" }}/>} ><Link to="/">Home</Link></Menu.Item>
                <Menu.Item key="2" icon={<MailOutlined style={{ fontSize: "18px" }}/>} ><Link to="/publish">Publish</Link></Menu.Item>        
                <SubMenu key="sub1" icon={<UserOutlined style={{ fontSize: "18px" }}/>} title="Account">
                  <Menu.Item key="3" ><Link to="/register">Register</Link></Menu.Item>        
                  <Menu.Item key="4"><Link to="/login">Login</Link></Menu.Item>    
                </SubMenu>               
              </Menu>
            </>
          )}
        </UserContext.Consumer>
      );  
    }

    return (
      <UserContext.Consumer>
        {({logout}) => (
          <>
            <div className="logo" />
            
            <Menu 
              theme="dark" 
              mode="inline" 
              style={{ fontSize: '18px' }} 
              defaultSelectedKeys={['1']}
              inlineCollapsed={this.state.collapsed}
              >
              <Menu.Item key="1" icon={<HomeOutlined style={{ fontSize: "18px" }}/>} ><Link to="/">Home</Link></Menu.Item>
              <Menu.Item key="2" icon={<MailOutlined style={{ fontSize: "18px" }}/>} ><Link to="/publish">Publish</Link></Menu.Item>   
              <SubMenu key="sub1" icon={<UserOutlined style={{ fontSize: "18px" }}/>} title="Account">
                <Menu.Item key="3" ><Link to="/account">Account Details</Link></Menu.Item>
                <Menu.Item key="4" ><Link to="/register">Register</Link></Menu.Item>        
                <Menu.Item key="5" onClick={logout}><Link to="/">Logout</Link></Menu.Item> 
              </SubMenu>               
            </Menu>
          </>
        )}
      </UserContext.Consumer>
    );
  }
}

export default Nav;