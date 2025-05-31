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
      message.warning('Please login to add books to your interested list');
      return;
    }

    try {
      setLoading(true);
      if (isInterested) {
        await userApi.deleteUserInterestedBook(currentUser._id, book._id);
        message.success('Book removed from interested list');
      } else {
        await userApi.updateUserInterestedBook(currentUser._id, { bookId: book._id });
        message.success('Book added to interested list');
      }
      setIsInterested(!isInterested);
    } catch (error) {
      console.error('Error updating interested book:', error);
      message.error('Failed to update interested book list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "sticky", top: 24 }}>
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
              Available
            </Tag>
          ) : (
            <Tag color="error" style={{ margin: "8px 0", padding: "4px 8px", fontSize: 14 }}>
              Borrowed
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
            {book.status === "available" ? "Borrow Book" : "Join Waitlist"}
          </Button>
          <Button 
            type={isInterested ? "primary" : "default"}
            icon={isInterested ? <HeartFilled /> : <HeartOutlined />}
            size="large"
            block
            onClick={handleInterested}
            loading={loading}
          >
            {isInterested ? "Remove from Interested" : "Add to Interested"}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default BookCover; 