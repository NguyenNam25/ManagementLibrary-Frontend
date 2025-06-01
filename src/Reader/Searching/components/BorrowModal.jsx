import React from "react";
import { Modal, Typography, Alert, InputNumber, Input, Button } from "antd";
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
          <span>Xác nhận mượn sách</span>
        </div>
      }
      open={visible}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      width={500}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="borrowMore" type="primary" onClick={onBorrowMore}>
          Mượn thêm
        </Button>,
        <Button key="ok" type="primary" loading={confirmLoading} onClick={onOk}>
          Xác nhận mượn
        </Button>,
      ]}
    >
      <div style={{ padding: "16px 0" }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>
            Thông tin sách:
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
              <strong>Tên sách:</strong> {book.name}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Tác giả:</strong> {book.author}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Thể loại:</strong> {category?.name}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>
            Quy định mượn sách:
          </Text>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Phí trả muộn: 1$ mỗi ngày</li>
            <li>Tối đa 3 cuốn sách cùng lúc</li>
            <li>Sách phải được trả trong tình trạng tốt</li>
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
