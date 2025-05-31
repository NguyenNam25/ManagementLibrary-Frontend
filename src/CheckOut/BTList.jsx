import React, { useState, useEffect } from "react";
import { Breadcrumb, Layout, Button, Table, Modal, message, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  AlertOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import BTColumns from "./BTColumns.jsx";
import BTDetailPopUp from "./BTDetailPopUp";
import borrowTicketApi from "../../api/borrowticket";
import userApi from "../../api/user";
import UserPopUp from "./UserPopUp";
import bookApi from "../../api/book/index.js";

const { Content } = Layout;

export default function BTList() {
  const navigate = useNavigate();
  const [borrowTickets, setBorrowTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBorrowTicket, setSelectedBorrowTicket] = useState(null);
  const [isUserDetailVisible, setIsUserDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchBorrowTickets();
  }, []);

  const fetchBorrowTickets = async () => {
    try {
      setLoading(true);
      const response = await borrowTicketApi.getAllBorrowTickets();
      const borrowTicketWithDetails = await Promise.all(
        response.data
          .filter(borrowTicket => borrowTicket.status !== "pending")
          .sort((a, b) => b.ticketId.localeCompare(a.ticketId))
          .map(async (borrowTicket) => {
            try {
              const userResponse = await userApi.getUserByLibraryCard(
                borrowTicket.cardNumber
              );
              const bookResponse = await borrowTicketApi.getListBookOfTicket(borrowTicket._id);

              const borrowedDate = new Date(borrowTicket.borrowDate);
              const dueDate = new Date(borrowedDate);
              dueDate.setDate(dueDate.getDate() + borrowTicket.allowedDays);

              if (borrowTicket.returnDate) {
                const returnDate = new Date(borrowTicket.returnDate);
                const delayDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
                
                if (delayDays > 5) {
                  borrowTicket.status = "expired";
                } 
              } else if (new Date() > dueDate) {
                borrowTicket.status = "expired";
              }

              return {
                ...borrowTicket,
                dueDate: dueDate.toISOString(),
                status: borrowTicket.status,
                user: userResponse.data,
                detail: buttonDetail({
                  ...borrowTicket,
                  dueDate: dueDate.toISOString(),
                  status: borrowTicket.status,
                  user: userResponse.data,
                  books: bookResponse.data,
                })
              };
            } catch (error) {
              console.error(
                `Error fetching details for borrow ticket ${borrowTicket._id}:`,
                error
              );
              return {
                ...borrowTicket,
                user: null,
                books: [],
                detail: buttonDetail(borrowTicket)
              };
            }
          })
      );
      setBorrowTickets(borrowTicketWithDetails);
    } catch (error) {
      message.error("Failed to fetch borrow tickets");
      console.error("Error fetching borrow tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredBorrowTickets = borrowTickets.filter(ticket => {
    const searchLower = searchText.toLowerCase();
    const books = Array.isArray(ticket.books) ? ticket.books : [];
    
    return (
      ticket.cardNumber?.toLowerCase().includes(searchLower) ||
      ticket.ticketId?.toLowerCase().includes(searchLower) ||
      ticket.user?.name?.toLowerCase().includes(searchLower) ||
      ticket.status?.toLowerCase().includes(searchLower) ||
      books.some(book => book?.name?.toLowerCase().includes(searchLower)) ||
      new Date(ticket.borrowDate).toLocaleDateString().includes(searchLower) ||
      new Date(ticket.dueDate).toLocaleDateString().includes(searchLower)
    );
  });
  
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

  const handleReturn = async (borrowTicket) => {
    console.log(borrowTicket);
    try {
      if (!Array.isArray(borrowTicket.books)) {
        message.error("Dữ liệu sách không hợp lệ");
        return;
      }

      const currentBooks = [];
      // Check if books are available
      for (const book of borrowTicket.books) {
        try {
          const bookResponse = await bookApi.getBookById(book);
          const currentBook = bookResponse.data;

          currentBooks.push(currentBook);
        } catch (error) {
          console.error(`Lỗi khi kiểm tra sách: ${book._id}`, error);
          message.error(`Không thể kiểm tra sách: ${book._id}`);
          return;
        }
      }

      for (const currentBook of currentBooks) {
        try {
          console.log(currentBook);
          const newQuantity = currentBook.quantity + 1;
          const newStatus = newQuantity > 0 ? "available" : "unavailable";

          await bookApi.updateBook(currentBook._id, {
            quantity: newQuantity,
            status: newStatus,
          });
        } catch (error) {
          console.error(`Lỗi khi cập nhật sách: ${currentBook._id}`, error);
          message.error(`Không thể cập nhật sách: ${currentBook.name}`);
          return;
        }
      }

      const returnDate = new Date().toISOString();
      await borrowTicketApi.updateBorrowTicket(borrowTicket._id, { 
        status: "returned",
        returnDate: returnDate
      });
      message.success("Book returned successfully");
      fetchBorrowTickets(); // Refresh the list
    } catch (error) {
      message.error("Failed to return book");
      console.error("Error returning book:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await borrowTicketApi.deleteBorrowTicket(id);
      message.success("Borrow ticket deleted successfully");
      fetchBorrowTickets(); // Refresh the list
    } catch (error) {
      message.error("Failed to delete borrow ticket");
      console.error("Error deleting borrow ticket:", error);
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
              placeholder="Search borrow tickets..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </div>
          <Table
            columns={BTColumns.map(col => {
              if (col.key === 'actions') {
                return {
                  ...col,
                  render: (_, record) => {
                    if (record.status === 'returned') {
                      return (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(record._id)}
                        >
                          Delete
                        </Button>
                      );
                    } else if (record.status === 'borrowed' || record.status === 'expired') {
                      return (
                        <Button
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          onClick={() => handleReturn(record)}
                          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        >
                          Return
                        </Button>
                      );
                    }
                    return null;
                  }
                };
              }
              return col;
            })}
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
                <span className="text-xl">Borrow List</span>
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
