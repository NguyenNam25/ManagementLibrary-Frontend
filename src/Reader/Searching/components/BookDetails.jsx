import React from 'react';
import { Card, Typography, Space, Tag, Divider, Descriptions, Button } from 'antd';
import { UserOutlined, CalendarOutlined, TagOutlined, ReadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const BookDetails = ({ 
  book, 
  category, 
  type, 
  onBorrow 
}) => {
  return (
    <Card>
      <Title level={2}>{book.name}</Title>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Text strong><UserOutlined /> Tác giả:</Text>
          <Text>{book.author}</Text>
        </Space>
        
        <Space style={{ marginLeft: 24 }}>
          <Text strong><CalendarOutlined /> Năm:</Text>
          <Text>{book.yearOfPublication}</Text>
        </Space>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        {category && (
          <Tag 
            icon={<TagOutlined />} 
            color="processing" 
            style={{ marginBottom: 8, padding: "4px 8px" }}
          >
            {category.name}
          </Tag>
        )}
        {type && (
          <Tag 
            icon={<TagOutlined />} 
            color="processing" 
            style={{ marginBottom: 8, padding: "4px 8px" }}
          >
            {type.name}
          </Tag>
        )}
      </div>
      
      <Paragraph style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: "pre-line" }}>
        {book.description}
      </Paragraph>

      <Divider orientation="left">Chi tiết sách</Divider>
      
      <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
        <Descriptions.Item label="Nhà xuất bản">{book.publisherName}</Descriptions.Item>
        <Descriptions.Item label="Năm xuất bản">{book.yearOfPublication}</Descriptions.Item>
        <Descriptions.Item label="Ngôn ngữ">{book.language}</Descriptions.Item>
        <Descriptions.Item label="Thể loại">{category?.name}</Descriptions.Item>
        <Descriptions.Item label="Loại sách">{type?.name}</Descriptions.Item>
        <Descriptions.Item label="Tình trạng">
          <Tag color={book.status === "available" ? "success" : "error"}>
            {book.status === "available" ? "Có sẵn" : "Đã mượn"}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Mô tả</Divider>
      
      <Paragraph style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: "pre-line" }}>
        {book.description}
      </Paragraph>
    </Card>
  );
};

export default BookDetails; 