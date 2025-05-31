import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Layout,
  Button,
  Table,
  Modal,
  message,
  Space,
  Input,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  AlertOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import WaitingColumns from "./WaitingColumn";
import BTDetailPopUp from "./BTDetailPopUp";
import UserPopUp from "./UserPopUp";
import borrowTicketApi from "../../api/borrowticket";
import userApi from "../../api/user";
import bookApi from "../../api/book";

const { Content } = Layout;

export default function WaitingBorrowList() {
  const navigate = useNavigate();
  const [borrowTickets, setBorrowTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBorrowTicket, setSelectedBorrowTicket] = useState(null);
  const [isUserDetailVisible, setIsUserDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchBorrowTickets = async () => {
    try {
      setLoading(true);
      const response = await borrowTicketApi.getAllBorrowTickets();
      const borrowTicketWithDetails = await Promise.all(
        response.data
          .filter((borrowTicket) => borrowTicket.status === "pending")
          .map(async (borrowTicket) => {
            try {
              const userResponse = await userApi.getUserByLibraryCard(
                borrowTicket.cardNumber
              );

              const bookResponse = await borrowTicketApi.getListBookOfTicket(
                borrowTicket._id
              );
              console.log(bookResponse);

              const borrowedDate = new Date(borrowTicket.borrowDate);
              const dueDate = new Date(borrowedDate);
              dueDate.setDate(dueDate.getDate() + borrowTicket.allowedDays);

              return {
                ...borrowTicket,
                dueDate: dueDate.toISOString(),
                user: userResponse.data,
                actions: getActionButtons(borrowTicket),
                detail: buttonDetail({
                  ...borrowTicket,
                  dueDate: dueDate.toISOString(),
                  user: userResponse.data,
                  books: bookResponse.data,
                }),
              };
            } catch (error) {
              console.error(
                `Error fetching details for borrow ticket ${borrowTicket._id}:`,
                error
              );
              return {
                ...borrowTicket,
                user: null,
                detail: buttonDetail(borrowTicket),
              };
            }
          })
      );
      setBorrowTickets(borrowTicketWithDetails);
    } catch (error) {
      message.error("Failed to fetch waiting tickets");
      console.error("Error fetching waiting tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowTickets();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredBorrowTickets = borrowTickets.filter((ticket) => {
    const searchLower = searchText.toLowerCase();
    const books = Array.isArray(ticket.books) ? ticket.books : [];

    return (
      ticket.ticketId?.toLowerCase().includes(searchLower) ||
      ticket.cardNumber?.toLowerCase().includes(searchLower) ||
      ticket.user?.name?.toLowerCase().includes(searchLower) ||
      books.some((book) => book?.name?.toLowerCase().includes(searchLower)) ||
      new Date(ticket.borrowDate).toLocaleDateString().includes(searchLower) ||
      new Date(ticket.dueDate).toLocaleDateString().includes(searchLower)
    );
  });

  const getActionButtons = (borrowTicket) => (
    <Space>
      <Button
        type="primary"
        icon={<CheckCircleOutlined />}
        onClick={() => handleApprove(borrowTicket)}
        style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
      >
        Approve
      </Button>
      <Button
        danger
        icon={<CloseCircleOutlined />}
        onClick={() => handleReject(borrowTicket)}
      >
        Reject
      </Button>
    </Space>
  );

  const buttonDetail = (borrowTicket) => (
    <Button
      type="primary"
      icon={<EyeOutlined />}
      onClick={() => {
        setSelectedBorrowTicket(borrowTicket);
        setIsModalVisible(true);
      }}
    ></Button>
  );

  const handleCardNumberClick = (borrowTicket) => {
    if (borrowTicket.user) {
      setSelectedUser(borrowTicket.user);
      setIsUserDetailVisible(true);
      setIsModalVisible(false);
    }
  };

  const handleReturnToBorrowTicket = () => {
    setIsUserDetailVisible(false);
    setIsModalVisible(true);
  };

  const handleApprove = async (borrowTicket) => {
    console.log(borrowTicket);
    try {
      if (!Array.isArray(borrowTicket.books)) return;

      const currentBooks = [];
      // Check if books are available
      for (const book of borrowTicket.books) {
        try {
          const bookResponse = await bookApi.getBookById(book);
          const currentBook = bookResponse.data;

          if (currentBook.quantity <= 0) {
            message.error(
              `Sách "${currentBook.name}" không còn sẵn sàng để mượn`
            );
            return;
          }

          currentBooks.push(currentBook);
        } catch (error) {
          console.error(`Lỗi khi kiểm tra sách: ${book._id}`, error);
          message.error(`Không thể kiểm tra sách: ${book._id}`);
          return;
        }
      }
      // 2. Cập nhật số lượng sách
      for (const currentBook of currentBooks) {
        try {
          console.log(currentBook);
          const newQuantity = currentBook.quantity - 1;
          const newStatus = newQuantity > 0 ? "available" : "unavailable";

          await bookApi.updateBook(currentBook._id, {
            quantity: newQuantity,
            status: newStatus,
            borrowCount: (currentBook.borrowCount) + 1
          });
        } catch (error) {
          console.error(`Lỗi khi cập nhật sách: ${currentBook._id}`, error);
          message.error(`Không thể cập nhật sách: ${currentBook.name}`);
          return;
        }
      }

      await borrowTicketApi.updateBorrowTicket(borrowTicket._id, {
        status: "borrowed",
      });
      message.success("Duyệt phiếu mượn thành công");
      fetchBorrowTickets(); // Refresh the list after approval
    } catch (error) {
      console.error("Lỗi khi duyệt phiếu mượn:", error);
      message.error("Có lỗi xảy ra khi duyệt phiếu mượn");
    }
  };

  const handleReject = async (borrowTicket) => {
    try {
      const response = await borrowTicketApi.deleteBorrowTicket(
        borrowTicket._id
      );
      console.log(response);
      message.success("Borrow ticket rejected successfully");
      fetchBorrowTickets(); // Refresh the list after rejection
    } catch (error) {
      console.error("Error rejecting borrow ticket:", error);
    }
  };

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <SideNav />
      <Layout style={{ background: "#f0f4f7" }}>
        <HeaderComponent />
        <Content style={{ margin: "0 16px" }}>
          <div style={{ marginTop: 20, marginBottom: 16 }}>
            <Input
              placeholder="Search waiting tickets..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </div>
          <Table
            columns={WaitingColumns}
            dataSource={filteredBorrowTickets}
            loading={loading}
            rowKey="_id"
            style={{ marginTop: 20 }}
            title={() => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="text-xl">Waiting List</span>
              </div>
            )}
          />
          <BTDetailPopUp
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            selectedBorrowTicket={selectedBorrowTicket}
            onCardNumberClick={handleCardNumberClick}
          />
          <UserPopUp
            isUserDetailVisible={isUserDetailVisible}
            setIsUserDetailVisible={setIsUserDetailVisible}
            selectedUser={selectedUser}
            handleReturnToBorrowTicket={handleReturnToBorrowTicket}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
