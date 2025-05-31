import React from 'react';
import { Tag, Button, Space, Typography } from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export const getBorrowTableColumns = (handleConfirmPickup, handleCancelRequest, isLocalStorageRequest) => [
  {
    title: "Ticket ID",
    dataIndex: "ticketId",
    key: "ticketId",
    render: (text, record) => (
      <strong>
        {isLocalStorageRequest && isLocalStorageRequest(record) ? "Pending Confirmation" : text}
      </strong>
    )
  },
  {
    title: "Books",
    dataIndex: "books",
    key: "books",
    render: (books) => (
      <>
        {books && books.length > 0 ? (
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {books.map(book => (
              <li key={book._id}>{book.title || book.name} - {book.author}</li>
            ))}
          </ul>
        ) : (
          <Text type="secondary">No books in this request</Text>
        )}
      </>
    )
  },
  {
    title: "Request Date",
    dataIndex: "borrowDate",
    key: "borrowDate",
    render: (date) => new Date(date).toLocaleDateString()
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status, record) => {
      let color = "default";
      let icon = null;
      let text = status;
      
      if (isLocalStorageRequest && isLocalStorageRequest(record)) {
        color = "warning";
        icon = <ClockCircleOutlined />;
        text = "PENDING CONFIRMATION";
      } else {
        switch (status) {
          case "pending":
            color = "warning";
            icon = <ClockCircleOutlined />;
            break;
          case "borrowed":
            color = "processing";
            icon = <BookOutlined />;
            break;
          case "returned":
            color = "success";
            icon = <CheckCircleOutlined />;
            break;
          case "expired":
            color = "error";
            icon = <ExclamationCircleOutlined />;
            break;
          default:
            color = "default";
        }
      }
      
      return (
        <Tag color={color} icon={icon}>
          {text.toUpperCase()}
        </Tag>
      );
    }
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => {
      if (isLocalStorageRequest && isLocalStorageRequest(record)) {
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirmPickup(record._id)}
            >
              Confirm Request
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancelRequest(record._id)}
            >
              Cancel
            </Button>
          </Space>
        );
      }

      return (
        <Space>
          {record.status === "pending" && (
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancelRequest(record._id)}
            >
              Cancel
            </Button>
          )}
          {record.status === "borrowed" && (
            <Button
              type="dashed"
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={() => notification.info({
                message: "Return Information",
                description: `Please return by ${new Date(record.borrowDate).getDate() + record.allowedDays} days from borrow date. You can return this book at the library information desk.`
              })}
            >
              Return Info
            </Button>
          )}
        </Space>
      );
    }
  }
]; 