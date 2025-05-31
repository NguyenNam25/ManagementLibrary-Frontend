import { Modal, Button, Divider } from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

export default function UserPopUp({
  isUserDetailVisible,
  setIsUserDetailVisible,
  selectedUser,
  handleReturnToBorrowTicket,
}) {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleReturnToBorrowTicket}
          />
          <span className="text-xl font-semibold">Thông tin người dùng</span>
        </div>
      }
      open={isUserDetailVisible}
      onCancel={() => setIsUserDetailVisible(false)}
      footer={null}
      width={800}
    >
      {selectedUser && (
        <div className="p-6">
          {/* Basic Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <UserOutlined className="mr-2" />
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Họ và tên</p>
                <p className="font-medium text-lg">{selectedUser.fullName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Email</p>
                <p className="font-medium text-lg">{selectedUser.email}</p>
              </div>
            </div>
          </div>

          <Divider className="my-6" />

          {/* Contact Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <PhoneOutlined className="mr-2" />
              Thông tin liên hệ
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
                <p className="font-medium text-lg">
                  {selectedUser.phoneNumber}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Địa chỉ</p>
                <p className="font-medium text-lg">
                  {selectedUser.address || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>

          <Divider className="my-6" />

          {/* Library Card Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <IdcardOutlined className="mr-2" />
              Thông tin thẻ thư viện
            </h3>
          
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Mã thẻ</p>
                <p className="font-medium text-lg">
                  {selectedUser.libraryCard.cardNumber}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Ngày cấp</p>
                  <p className="font-medium text-lg">
                    {new Date(
                      selectedUser.libraryCard.registrationDate
                    ).toLocaleDateString("vi-VN")}
                  </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
