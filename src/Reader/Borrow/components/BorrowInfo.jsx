import React from 'react';
import { Card, Typography } from 'antd';

const { Paragraph } = Typography;

const BorrowInfo = () => {
  return (
    <Card title="Borrowing Information">
      <Paragraph>
        <strong>Loan Period:</strong> Books can be borrowed for 14 days.
      </Paragraph>
      <Paragraph>
        <strong>Limit:</strong> You can borrow up to 5 items at a time.
      </Paragraph>
      <Paragraph>
        <strong>Renewals:</strong> Books can be renewed twice if not reserved by another reader.
      </Paragraph>
      <Paragraph>
        <strong>Overdue Fine:</strong> $0.25 per day for each overdue item.
      </Paragraph>
    </Card>
  );
};

export default BorrowInfo; 