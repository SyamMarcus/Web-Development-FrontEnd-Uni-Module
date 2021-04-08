import { PageHeader } from 'antd'
import React from 'react';

function Account(props) {
  return (
    <>
    <div className="site-layout-content">
      <div style={{ padding: '2% 25%' }}>
        <PageHeader className="site-page-header"
          title="Account page"
          subTitle="This is where you can edit account settings."/>
        </div>  
        <p>This is where account information will be displayed</p>
      </div>
    </>
  );
}

export default Account;