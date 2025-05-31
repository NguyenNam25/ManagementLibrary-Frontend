import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

const LibraryInfo = ({ book }) => {
  return (
    <Card title="Library Information" style={{ marginBottom: 16 }}>
      <div>
        <Text>Total Copies: {book.quantity}</Text>
        <br />
        <Text>Available: {book.status === "available" ? book.quantity : 0}</Text>
        <br />
        <Text>Borrowed: {book.status === "borrowed" ? book.quantity : 0}</Text>
      </div>
    </Card>
  );
};

export default LibraryInfo; 