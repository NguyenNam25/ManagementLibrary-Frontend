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
          <Text strong><UserOutlined /> Author:</Text>
          <Text>{book.author}</Text>
        </Space>
        
        <Space style={{ marginLeft: 24 }}>
          <Text strong><CalendarOutlined /> Year:</Text>
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

      <Divider orientation="left">Book Details</Divider>
      
      <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
        <Descriptions.Item label="Publisher">{book.publisherName}</Descriptions.Item>
        <Descriptions.Item label="Year">{book.yearOfPublication}</Descriptions.Item>
        <Descriptions.Item label="Language">{book.language}</Descriptions.Item>
        <Descriptions.Item label="Category">{category?.name}</Descriptions.Item>
        <Descriptions.Item label="Type">{type?.name}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={book.status === "available" ? "success" : "error"}>
            {book.status === "available" ? "Available" : "Borrowed"}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Description</Divider>
      
      <Paragraph style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: "pre-line" }}>
        {book.description}
      </Paragraph>
    </Card>
  );
};

export default BookDetails; 