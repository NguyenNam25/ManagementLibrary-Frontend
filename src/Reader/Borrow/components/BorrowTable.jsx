import React from 'react';
import { Table, Card, Empty, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { getBorrowTableColumns } from './BorrowTableColumns';

const BorrowTable = ({ 
  loading, 
  filteredRequests, 
  activeTab, 
  handleConfirmPickup, 
  handleCancelRequest,
  isLocalStorageRequest
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading your borrow requests...</div>
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <Card>
        <Empty 
          description={`You don't have any ${activeTab} requests`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        {activeTab === "pending" && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/reader/search">
              <Button type="primary">Browse Books</Button>
            </Link>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Table
      columns={getBorrowTableColumns(handleConfirmPickup, handleCancelRequest, isLocalStorageRequest)}
      dataSource={filteredRequests}
      rowKey="_id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default BorrowTable; 