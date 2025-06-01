import React from 'react';
import { Card, Typography } from 'antd';

const { Paragraph } = Typography;

const BorrowInfo = () => {
  return (
    <Card title="Thông tin mượn sách">
      <Paragraph>
        <strong>Thời hạn mượn:</strong> Sách có thể được mượn trong 14 ngày.
      </Paragraph>
      <Paragraph>
        <strong>Giới hạn:</strong> Bạn có thể mượn tối đa 5 cuốn sách cùng lúc.
      </Paragraph>
      <Paragraph>
        <strong>Gia hạn:</strong> Sách có thể được gia hạn hai lần nếu không có người đọc khác đặt trước.
      </Paragraph>
      <Paragraph>
        <strong>Phí quá hạn:</strong> 0.25$ mỗi ngày cho mỗi cuốn sách quá hạn.
      </Paragraph>
    </Card>
  );
};

export default BorrowInfo; 