import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

const LibraryInfo = ({ book }) => {
  return (
    <Card title="Thông tin thư viện" style={{ marginBottom: 16 }}>
      <div>
        <Text>Tổng số bản sao: {book.quantity}</Text>
        <br />
        <Text>Có sẵn: {book.status === "available" ? book.quantity : 0}</Text>
        <br />
        <Text>Đang mượn: {book.status === "borrowed" ? book.quantity : 0}</Text>
      </div>
    </Card>
  );
};

export default LibraryInfo; 