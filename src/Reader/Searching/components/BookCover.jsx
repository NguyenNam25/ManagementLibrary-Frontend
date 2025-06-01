import React, { useState } from 'react';
import { Card, Tag, Button, Space, message } from 'antd';
import { ReadOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import userApi from '../../../../api/user';

const BookCover = ({ 
  book, 
  isLoggedIn, 
  onBorrow,
  currentUser,
}) => {
  const [isInterested, setIsInterested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInterested = async () => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để thêm sách vào danh sách quan tâm');
      return;
    }

    try {
      setLoading(true);
      if (isInterested) {
        await userApi.deleteUserInterestedBook(currentUser._id, book._id);
        message.success('Đã xóa sách khỏi danh sách quan tâm');
      } else {
        await userApi.updateUserInterestedBook(currentUser._id, { bookId: book._id });
        message.success('Đã thêm sách vào danh sách quan tâm');
      }
      setIsInterested(!isInterested);
    } catch (error) {
      console.error('Error updating interested book:', error);
      message.error('Không thể cập nhật danh sách sách quan tâm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ top: 24 }}>
      <Card 
        cover={
          <img 
            alt={book.name} 
            src={book.image || "https://via.placeholder.com/300x400?text=No+Image"} 
            style={{ 
              width: "100%", 
              height: "auto",
              objectFit: "cover", 
              maxHeight: "400px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }} 
          />
        }
        style={{ marginBottom: 16 }}
      >
        <div style={{ textAlign: "center" }}>
          {book.status === "available" ? (
            <Tag color="success" style={{ margin: "8px 0", padding: "4px 8px", fontSize: 14 }}>
              Có sẵn
            </Tag>
          ) : (
            <Tag color="error" style={{ margin: "8px 0", padding: "4px 8px", fontSize: 14 }}>
              Đã mượn
            </Tag>
          )}
        </div>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            icon={<ReadOutlined />} 
            size="large" 
            block 
            onClick={onBorrow}
            disabled={book.status !== "available" || book.quantity <= 0}
          >
            {book.status === "available" ? "Mượn sách" : "Đăng ký chờ"}
          </Button>
          <Button 
            type={isInterested ? "primary" : "default"}
            icon={isInterested ? <HeartFilled /> : <HeartOutlined />}
            size="large"
            block
            onClick={handleInterested}
            loading={loading}
          >
            {isInterested ? "Xóa khỏi danh sách quan tâm" : "Thêm vào danh sách quan tâm"}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default BookCover; 