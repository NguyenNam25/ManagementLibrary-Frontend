import { Modal } from "antd";

export default function BookDetailPopUp({
  isModalVisible,
  setIsModalVisible,
  selectedBook,
}) {
  return (
    <Modal
      title="Chi tiết sách"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={800}
    >
      {selectedBook && (
        <div className="p-4">
          <div className="flex gap-8">
            <div className="w-1/3">
              <img
                src={selectedBook.image}
                alt={selectedBook.name}
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/200x300?text=No+Image";
                }}
              />
            </div>
            <div className="w-2/3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Tên sách</p>
                  <p className="font-medium">{selectedBook.name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Tác giả</p>
                  <p className="font-medium">{selectedBook.author}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Loại</p>
                  <p className="font-medium">{selectedBook.type}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Thể loại</p>
                  <p className="font-medium">{selectedBook.category}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Nhà xuất bản</p>
                  <p className="font-medium">{selectedBook.publisherName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Ngôn ngữ</p>
                  <p className="font-medium">{selectedBook.language === "vi" ? "Tiếng Việt" : "Tiếng Anh"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Số lượng</p>
                  <p className="font-medium">{selectedBook.quantity}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Năm xuất bản</p>
                  <p className="font-medium">
                    {selectedBook.yearOfPublication}
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
