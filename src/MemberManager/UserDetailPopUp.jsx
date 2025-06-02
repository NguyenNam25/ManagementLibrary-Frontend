import { Modal } from "antd";
import { Card, Tag } from "antd";
import { UserOutlined, BookOutlined, CalendarOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, IdcardOutlined } from '@ant-design/icons';

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
      width={900}
      className="user-detail-modal"
    >
      {selectedUser && (
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* User Image and Card Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg mb-8">
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
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <IdcardOutlined className="text-2xl" />
                      <span className="font-semibold text-lg">Thẻ thư viện</span>
                    </div>
                    <Tag color="white" className="text-blue-600 font-medium px-4 py-1 text-sm">
                      {selectedUser.libraryCard.status || 'Active'}
                    </Tag>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm opacity-80 mb-1">Mã thẻ</p>
                      <p className="font-mono text-xl tracking-wider">{selectedUser.libraryCard.cardNumber}</p>
                    </div>
                    <div className="border-t border-blue-400/30 my-4"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm opacity-80 mb-1">Ngày cấp</p>
                        <p className="font-medium">{new Date(selectedUser.libraryCard.registrationDate).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80 mb-1">Ngày hết hạn</p>
                        <p className="font-medium">{new Date(selectedUser.libraryCard.expirationDate).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* User Information Section */}
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">{selectedUser.fullName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <UserOutlined className="text-lg" />
                    <p className="text-sm">Giới tính</p>
                  </div>
                  <p className="font-medium text-gray-800 text-lg">{selectedUser.gender === 'male' ? "Nam" : "Nữ"}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <CalendarOutlined className="text-lg" />
                    <p className="text-sm">Ngày sinh</p>
                  </div>
                  <p className="font-medium text-gray-800 text-lg">{new Date(selectedUser.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <MailOutlined className="text-lg" />
                    <p className="text-sm">Email</p>
                  </div>
                  <p className="font-medium text-gray-800 text-lg">{selectedUser.email}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <PhoneOutlined className="text-lg" />
                    <p className="text-sm">Số điện thoại</p>
                  </div>
                  <p className="font-medium text-gray-800 text-lg">{selectedUser.phoneNumber}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
                  <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <EnvironmentOutlined className="text-lg" />
                    <p className="text-sm">Địa chỉ</p>
                  </div>
                  <p className="font-medium text-gray-800 text-lg">{selectedUser.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
