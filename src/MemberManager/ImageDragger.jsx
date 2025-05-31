import { message, Upload, Button } from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function ImageDragger({ value, onChange }) {
  const [previewImage, setPreviewImage] = useState(value);

  const uploadProps = {
    name: "image",
    multiple: false,
    maxCount: 1,
    accept: ".jpg,.png,.jpeg",
    beforeUpload: (file) => {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      onChange?.(file); // Pass just the file
      return false; // Prevent automatic upload
    },
    onChange(info) {
      const { status } = info.file;
      console.log(info.file);
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onChange?.(null); // Clear the form value
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {previewImage ? (
        <div style={{ textAlign: "center", position: "relative" }}>
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              objectFit: "contain",
            }}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemoveImage}
            style={{ position: "absolute", top: "8px", right: "8px" }}
          >
            Xóa ảnh
          </Button>
        </div>
      ) : (
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click hoặc kéo file và thả vào đây để tải lên
          </p>
          <p className="ant-upload-hint">
            Tệp tải lên tối đa 5MB, định dạng: .jpg, .png, .jpeg
          </p>
        </Upload.Dragger>
      )}
    </div>
  );
}
