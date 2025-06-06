import { Modal } from "antd";
import { Card, Tag } from "antd";
import {
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  SolutionOutlined,
  BankOutlined,
} from "@ant-design/icons";

export default function UserDetailPopUp({
  isModalVisible,
  setIsModalVisible,
  selectedUser,
}) {
  return (
    <Modal
      title="Chi tiết người dùng"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={1000}
      className="user-detail-modal"
    >
      {selectedUser && (
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* User Image and Card Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg mb-6">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Library Card - Only show if user has a cardId */}
              {selectedUser.libraryCard && (
                <Card
                  className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl"
                  bordered={false}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <IdcardOutlined className="text-xl" />
                      <span className="font-semibold">Thẻ thư viện</span>
                    </div>
                    <Tag
                      color="white"
                      className="text-blue-600 font-medium px-3 py-0.5 text-xs"
                    >
                      {selectedUser.libraryCard.status || "Active"}
                    </Tag>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs opacity-80 mb-0.5">Mã thẻ</p>
                      <p className="font-mono text-lg tracking-wider">
                        {selectedUser.libraryCard.cardNumber}
                      </p>
                    </div>
                    <div className="border-t border-blue-400/30 my-3"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs opacity-80 mb-0.5">Ngày cấp</p>
                        <p className="font-medium text-sm">
                          {new Date(
                            selectedUser.libraryCard.registrationDate
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80 mb-0.5">
                          Ngày hết hạn
                        </p>
                        <p className="font-medium text-sm">
                          {new Date(
                            selectedUser.libraryCard.expirationDate
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* User Information Section */}
            <div className="w-full md:w-2/3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedUser.fullName}
                </h2>
                <Tag
                  color={
                    selectedUser.status === "active"
                      ? "green"
                      : selectedUser.status === "inactive"
                      ? "red"
                      : "orange"
                  }
                  className="text-sm px-3 py-0.5"
                >
                  {selectedUser.status === "active"
                    ? "Hoạt động"
                    : selectedUser.status === "inactive"
                    ? "Không hoạt động"
                    : "Đang chờ xác nhận"}
                </Tag>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <UserOutlined className="text-base" />
                    <p className="text-xs">Giới tính</p>
                  </div>
                  <p className="font-medium text-gray-800">
                    {selectedUser.gender === "male" ? "Nam" : "Nữ"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <CalendarOutlined className="text-base" />
                    <p className="text-xs">Ngày sinh</p>
                  </div>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedUser.dateOfBirth).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <MailOutlined className="text-base" />
                    <p className="text-xs">Email</p>
                  </div>
                  <p className="font-medium text-gray-800">
                    {selectedUser.email}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <PhoneOutlined className="text-base" />
                    <p className="text-xs">Số điện thoại</p>
                  </div>
                  <p className="font-medium text-gray-800">
                    {selectedUser.phoneNumber}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <SolutionOutlined className="text-base" />
                    <p className="text-xs">CMND/CCCD</p>
                  </div>
                  <p className="font-medium text-gray-800">
                    {selectedUser.citizenId}
                  </p>
                </div>
                {selectedUser.occupation && (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <BankOutlined className="text-base" />
                      <p className="text-xs">Nghề nghiệp</p>
                    </div>
                    <p className="font-medium text-gray-800">
                      {selectedUser.occupation}
                    </p>
                  </div>
                )}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <EnvironmentOutlined className="text-base" />
                    <p className="text-xs">Địa chỉ</p>
                  </div>
                  <p className="font-medium text-gray-800">
                    {selectedUser.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
