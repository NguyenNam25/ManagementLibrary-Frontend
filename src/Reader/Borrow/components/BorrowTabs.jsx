import React from 'react';
import { Tabs, Tag } from 'antd';
import {
  ClockCircleOutlined,
  BookOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import BorrowTable from './BorrowTable';

const BorrowTabs = ({ 
  activeTab, 
  setActiveTab, 
  pendingRequests, 
  borrowedRequests, 
  returnedRequests,
  loading,
  handleConfirmPickup,
  handleCancelRequest,
  isLocalStorageRequest
}) => {
  return (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      type="card"
      size="large"
      style={{ marginBottom: 24 }}
    >
      <Tabs.TabPane 
        tab={
          <span>
            <ClockCircleOutlined /> Yêu cầu đang chờ
            {pendingRequests.length > 0 && (
              <Tag color="warning" style={{ marginLeft: 8 }}>
                {pendingRequests.length}
              </Tag>
            )}
          </span>
        } 
        key="pending"
      >
        <BorrowTable 
          loading={loading}
          filteredRequests={pendingRequests}
          activeTab={activeTab}
          handleConfirmPickup={handleConfirmPickup}
          handleCancelRequest={handleCancelRequest}
          isLocalStorageRequest={isLocalStorageRequest}
        />
      </Tabs.TabPane>

      <Tabs.TabPane 
        tab={
          <span>
            <BookOutlined /> Sách đang mượn
            {borrowedRequests.length > 0 && (
              <Tag color="processing" style={{ marginLeft: 8 }}>
                {borrowedRequests.length}
              </Tag>
            )}
          </span>
        } 
        key="borrowed"
      >
        <BorrowTable 
          loading={loading}
          filteredRequests={borrowedRequests}
          activeTab={activeTab}
          handleConfirmPickup={handleConfirmPickup}
          handleCancelRequest={handleCancelRequest}
          isLocalStorageRequest={isLocalStorageRequest}
        />
      </Tabs.TabPane>

      <Tabs.TabPane 
        tab={
          <span>
            <HistoryOutlined /> Sách đã trả
            {returnedRequests.length > 0 && (
              <Tag color="success" style={{ marginLeft: 8 }}>
                {returnedRequests.length}
              </Tag>
            )}
          </span>
        } 
        key="returned"
      >
        <BorrowTable 
          loading={loading}
          filteredRequests={returnedRequests}
          activeTab={activeTab}
          handleConfirmPickup={handleConfirmPickup}
          handleCancelRequest={handleCancelRequest}
          isLocalStorageRequest={isLocalStorageRequest}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default BorrowTabs; 