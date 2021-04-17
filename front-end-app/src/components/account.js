import React from 'react';
import { PageHeader, Button, Upload, message } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { UploadOutlined } from '@ant-design/icons';


class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
    }
  }


  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('upload', file);
    });

    this.setState({
      uploading: true,
    });

    fetch('http://localhost:3030/TCS/listings/images', {
      method: "POST",
      body: formData,
    })
    .then(status)
    .then(json)
    .then(data => {
      console.log(data);
      this.setState({
        // ACTUALLY USE NESTED CALLBACK LIKE PREVIOUS AND PASS data.file.path 
        // remove submit button and change onFinish form method to use nested callback
        fileList: [], // Resets fileList displayed?
        uploading: false,
      });
      message.success('upload successfully.');
    })
    .then( )
    .catch(errorResponse => {
      this.setState({
        uploading: false,
      });
      message.error('upload failed.');
      console.error(errorResponse);
      alert(`Error: ${errorResponse}`);
    });  
  };

 render() {

  const { uploading, fileList } = this.state;
  const props = {
    onRemove: file => {
      this.setState(state => {
        const index = state.fileList.indexOf(file);
        const newFileList = state.fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList,
        };
      });
    },

    beforeUpload: file => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        return message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return message.error('Image must smaller than 2MB!');
      }

      this.setState(state => ({
        fileList: [...state.fileList, file],
      }));
      return false
    },
    fileList,
  };

  return (
    <>
      <div className="site-layout-content">
        <div style={{ padding: '2% 25%' }}>
          <PageHeader className="site-page-header"
            title="Account page"
            subTitle="This is where you can edit account settings."/>
        </div>  
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0 || fileList.length > 1}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </div>
      </>
    );  
  };
};

export default Account;