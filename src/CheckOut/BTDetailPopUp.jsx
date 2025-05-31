import { Modal, Divider } from "antd";
import { RightOutlined, BookOutlined, CalendarOutlined, IdcardOutlined, CheckCircleOutlined } from "@ant-design/icons";

export default function BTDetailPopUp({
  isModalVisible,
  setIsModalVisible,
  selectedBorrowTicket,
  onCardNumberClick,
}) {
  const getStatusText = (status) => {
    switch (status) {
      case "expired":
        return "Quá hạn";
      case "returned":
        return "Đã trả";
      default:
        return "Đang mượn";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "expired":
        return "text-red-500";
      case "returned":
        return "text-green-500";
      default:
        return "text-blue-500";
    }
  };

  // const getListBookName = () => {
  //   selectedBorrowTicket.books.map((book) => book.name).join(", ");
  // };

  // console.log(getListBookName);

  return (
    <Modal
      title={
        <div className="text-xl font-semibold">
          Chi tiết phiếu mượn sách
        </div>
      }
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={800}
    >
      {selectedBorrowTicket && (
        <div className="p-6">
          {/* Basic Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <IdcardOutlined className="mr-2" />
              Thông tin phiếu mượn
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Mã phiếu mượn</p>
                <p className="font-medium text-lg">{selectedBorrowTicket.ticketId}</p>
              </div>
              <div
                className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 group"
                onClick={() =>
                  onCardNumberClick && onCardNumberClick(selectedBorrowTicket)
                }
              >
                <p className="text-gray-500 text-sm mb-1">Mã thẻ thư viện</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-lg">{selectedBorrowTicket.cardNumber}</p>
                  <RightOutlined className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            </div>
          </div>

          <Divider className="my-6" />

          {/* Dates and Status Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <CalendarOutlined className="mr-2" />
              Thông tin thời gian
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Ngày mượn</p>
                <p className="font-medium">{new Date(selectedBorrowTicket.borrowDate).toLocaleDateString('vi-VN')}</p>
              </div>
              {selectedBorrowTicket.returnDate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm mb-1">Ngày trả</p>
                  <p className="font-medium">{new Date(selectedBorrowTicket.returnDate).toLocaleDateString('vi-VN')}</p>
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Hạn trả</p>
                <p className="font-medium">{new Date(selectedBorrowTicket.dueDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>

          <Divider className="my-6" />

          {/* Books Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BookOutlined className="mr-2" />
              Danh sách sách
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm">Trạng thái</p>
                <p className={`font-medium ${getStatusColor(selectedBorrowTicket.status)}`}>
                  {getStatusText(selectedBorrowTicket.status)}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-sm mb-2">Sách đã mượn:</p>
                <div className="bg-white p-3 rounded border">
                  {selectedBorrowTicket.books.books.map((book, index) => (
                    <div key={index} className="flex items-center py-2">
                      <CheckCircleOutlined className="text-green-500 mr-2" />
                      <span className="text-gray-700">{book.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
