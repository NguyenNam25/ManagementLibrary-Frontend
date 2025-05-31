import React from 'react';
import { Layout, Spin } from 'antd';
import ReaderNav from '../../Layout/ReaderNav';

const { Content } = Layout;

const LoadingState = () => {
  return (
    <Layout>
      <div>
        <ReaderNav />
      </div>
      <Content style={{ padding: "24px", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Spin size="large" />
          <span style={{ marginLeft: 12 }}>Loading book details...</span>
        </div>
      </Content>
    </Layout>
  );
};

export default LoadingState; 