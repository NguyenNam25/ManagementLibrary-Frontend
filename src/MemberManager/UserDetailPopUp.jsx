import { Modal } from "antd";

export default function UserDetailPopUp({
  isModalVisible,
  setIsModalVisible,
  selectedUser,
}) {
  return (
    <Modal
      title="Chi tiết sách"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={800}
    >
      {selectedUser && (
        <div className="p-4">
          <div className="flex gap-8">
            <div className="w-1/3">
              <img
                src={selectedUser.image}
                alt={selectedUser.name}
                className="w-full h-auto rounded-lg shadow-md"
                
              />
            </div>
            <div className="w-2/3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Họ và tên</p>
                  <p className="font-medium">{selectedUser.fullName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm">Giới tính</p>
                    <p className="font-medium">{selectedUser.gender}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Vai trò</p>
                  <p className="font-medium">{selectedUser.role}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm">Ngày sinh</p>
                    <p className="font-medium">{selectedUser.dateOfBirth}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Số điện thoại</p>
                  <p className="font-medium">{selectedUser.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
