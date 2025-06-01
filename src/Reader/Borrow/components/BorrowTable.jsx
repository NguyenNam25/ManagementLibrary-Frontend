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
        <div style={{ marginTop: 16 }}>Đang tải yêu cầu mượn sách của bạn...</div>
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <Card>
        <Empty 
          description={`Bạn không có yêu cầu ${activeTab} nào`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        {activeTab === "pending" && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/reader/search">
              <Button type="primary">Tìm sách</Button>
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