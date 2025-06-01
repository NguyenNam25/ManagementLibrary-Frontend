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
    title: "Mã phiếu mượn",
    dataIndex: "ticketId",
    key: "ticketId",
    render: (text, record) => (
      <strong>
        {isLocalStorageRequest && isLocalStorageRequest(record) ? "Đang chờ xác nhận" : text}
      </strong>
    )
  },
  {
    title: "Sách",
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
          <Text type="secondary">Không có sách trong yêu cầu này</Text>
        )}
      </>
    )
  },
  {
    title: "Ngày yêu cầu",
    dataIndex: "borrowDate",
    key: "borrowDate",
    render: (date) => new Date(date).toLocaleDateString()
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status, record) => {
      let color = "default";
      let icon = null;
      let text = status;
      
      if (isLocalStorageRequest && isLocalStorageRequest(record)) {
        color = "warning";
        icon = <ClockCircleOutlined />;
        text = "ĐANG CHỜ XÁC NHẬN";
      } else {
        switch (status) {
          case "pending":
            color = "warning";
            icon = <ClockCircleOutlined />;
            text = "ĐANG CHỜ";
            break;
          case "borrowed":
            color = "processing";
            icon = <BookOutlined />;
            text = "ĐANG MƯỢN";
            break;
          case "returned":
            color = "success";
            icon = <CheckCircleOutlined />;
            text = "ĐÃ TRẢ";
            break;
          case "expired":
            color = "error";
            icon = <ExclamationCircleOutlined />;
            text = "HẾT HẠN";
            break;
          default:
            color = "default";
        }
      }
      
      return (
        <Tag color={color} icon={icon}>
          {text}
        </Tag>
      );
    }
  },
  {
    title: "Thao tác",
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
              Xác nhận yêu cầu
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancelRequest(record._id)}
            >
              Hủy
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
              Hủy
            </Button>
          )}
          {record.status === "borrowed" && (
            <Button
              type="dashed"
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={() => notification.info({
                message: "Thông tin trả sách",
                description: `Vui lòng trả sách trong vòng ${new Date(record.borrowDate).getDate() + record.allowedDays} ngày kể từ ngày mượn. Bạn có thể trả sách tại quầy thông tin thư viện.`
              })}
            >
              Thông tin trả sách
            </Button>
          )}
        </Space>
      );
    }
  }
]; 