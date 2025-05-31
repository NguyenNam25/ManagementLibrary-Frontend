import React from "react";
import { Modal, Typography, Alert, InputNumber, Input } from "antd";
import { ReadOutlined } from "@ant-design/icons";

const { Text } = Typography;

const BorrowModal = ({
  visible,
  onOk,
  onCancel,
  confirmLoading,
  book,
  category,
  onBorrowMore,
}) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ReadOutlined style={{ color: "#1890ff" }} />
          <span>Confirm Book Borrowing</span>
        </div>
      }
      open={visible}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onBorrowMore={onBorrowMore}
      okText="Confirm Borrow"
      cancelText="Cancel"
      width={500}
    >
      <div style={{ padding: "16px 0" }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>
            Book Information:
          </Text>
          <div
            style={{
              marginTop: 8,
              padding: 12,
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Title:</strong> {book.name}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Author:</strong> {book.author}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Category:</strong> {category?.name}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>
            Borrowing Period:
          </Text>
          <div style={{ marginTop: 8 }}>
            <Input
              type="number"
              min={1}
              max={30}
              defaultValue={1}
              style={{ width: 60 }}
            />
            <Text style={{ marginLeft: 8 }}>days</Text>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>
            Borrowing Rules:
          </Text>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Late return fee: $1 per day</li>
            <li>Maximum 3 books at a time</li>
            <li>Books must be returned in good condition</li>
          </ul>
        </div>

        {/* <Alert
          message="Important"
          description="Please ensure you can return the book on time to avoid late fees. You can renew the book once if no one else has requested it."
          type="info"
          showIcon
        /> */}
      </div>
    </Modal>
  );
};

export default BorrowModal;
