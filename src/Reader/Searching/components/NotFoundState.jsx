import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ReaderNav from '../../Layout/ReaderNav';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const NotFoundState = ({ onGoBack }) => {
  return (
    <Layout>
      <div>
        <ReaderNav />
      </div>
      <Content style={{ padding: "24px", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ textAlign: "center" }}>
          <Title level={3}>Book not found</Title>
          <Paragraph>The book you are looking for might have been removed or is not available.</Paragraph>
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={onGoBack}
          >
            Go Back
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default NotFoundState; 