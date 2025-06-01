import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Empty,
  notification,
  Modal,
  Breadcrumb,
  Button,
  Form,
  DatePicker,
  InputNumber,
} from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReaderNav from "../Layout/ReaderNav";
import borrowTicketApi from "../../../api/borrowticket";
import userApi from "../../../api/user";
import bookApi from "../../../api/book";
import BorrowTabs from "./components/BorrowTabs";
import BorrowInfo from "./components/BorrowInfo";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { confirm } = Modal;

export default function BorrowRequest() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndFetchData();
    // Get borrow request data from localStorage
    const stored = localStorage.getItem("borrowData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedBooks(parsed); // This is the borrowRequest object
    }
  }, []);

  const checkUserAndFetchData = async () => {
    try {
      const userResponse = await userApi.getCurrentUser();
      setCurrentUser(userResponse.data);
      if (userResponse.data?.libraryCard?.cardNumber) {
        fetchBorrowRequests(userResponse.data.libraryCard.cardNumber);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      notification.error({
        message: "Authentication Error",
        description: "Please log in to view your borrow requests.",
      });
      navigate("/reader/login");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const borrowDate = values.borrowDate.format("YYYY-MM-DD");
      const allowedDays = values.allowedDays;

      // Create borrow request using the existing object and adding new fields
      const borrowRequest = {
        ...selectedBooks,
        borrowDate,
        allowedDays,
        status: "pending",
      };

      const response = await borrowTicketApi.createBorrowTicket(borrowRequest);

      // Clear localStorage after successful creation
      localStorage.removeItem("borrowData");
      setSelectedBooks(null);

      // Refresh the requests list
      fetchBorrowRequests(currentUser.libraryCard.cardNumber);

      notification.success({
        message: "Borrow Request Created",
        description: "Your borrow request has been submitted successfully.",
      });

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating borrow request:", error);
      notification.error({
        message: "Failed to create borrow request",
        description: "Please try again later.",
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const fetchBorrowRequests = async (cardNumber) => {
    try {
      setLoading(true);
      const response = await borrowTicketApi.getAllBorrowTickets();

      let userRequests = response.data.filter(
        (ticket) => ticket.cardNumber === cardNumber
      );

      const requestsWithDetails = await Promise.all(
        userRequests.map(async (request) => {
          try {
            const listBookResponse = await borrowTicketApi.getListBookOfTicket(
              request._id
            );
            const books = await Promise.all(
              listBookResponse.data.books.map(async (bookId) => {
                try {
                  const bookResponse = await bookApi.getBookById(bookId._id);
                  return bookResponse.data;
                } catch (err) {
                  console.error(`Error fetching book ${bookId}:`, err);
                  return null;
                }
              })
            );
            return {
              ...request,
              books: books.filter((book) => book !== null),
              key: request._id,
            };
          } catch (error) {
            console.error("Error fetching book details:", error);
            return {
              ...request,
              books: [],
              key: request._id,
            };
          }
        })
      );
      setRequests(requestsWithDetails);
    } catch (error) {
      console.error("Error fetching borrow requests:", error);
      notification.error({
        message: "Failed to load borrow requests",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocalStorageCancel = (requestId) => {
    // Clear localStorage and state
    localStorage.removeItem("borrowData");
    setSelectedBooks(null);
    notification.success({
      message: "Request Cancelled",
      description: "Your borrow request has been cancelled.",
    });
  };

  const handleDatabaseCancel = async (requestId) => {
    try {
      console.log("Request ID:", requestId);
      await borrowTicketApi.deleteBorrowTicket(requestId);
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      notification.success({
        message: "Request Cancelled",
        description: "Your borrow request has been cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling request:", error);
      notification.error({
        message: "Failed to cancel request",
        description: "Please try again later.",
      });
    }
  };

  const handleCancelRequest = async (requestId) => {
    // Check if this is a localStorage request
    if (selectedBooks && requestId.startsWith('temp-')) {
      handleLocalStorageCancel(requestId);
    } else {
      // For database requests
      handleDatabaseCancel(requestId);
    }
  };

  const handleConfirmPickup = async (requestId) => {
    // Check if this is a localStorage request
    if (selectedBooks && requestId.startsWith('temp-')) {
      setIsModalVisible(true);
      return;
    }
    // For database requests
    confirm({
      title: "Confirm Book Pickup",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      content:
        "Please confirm that you have picked up this book from the library.",
      async onOk() {
        try {
          await borrowTicketApi.updateBorrowTicket(requestId, {
            status: "pending",
          });
          setRequests((prevRequests) =>
            prevRequests.map((request) =>
              request._id === requestId
                ? { ...request, status: "pending" }
                : request
            )
          );

          notification.success({
            message: "Pickup Confirmed",
            description: "Book pickup has been confirmed. Enjoy your reading!",
          });
        } catch (error) {
          console.error("Error confirming pickup:", error);
          notification.error({
            message: "Failed to confirm pickup",
            description: "Please try again later.",
          });
        }
      },
    });
  };

  const renderContent = () => {
    if (!currentUser) {
      return (
        <Card>
          <Empty
            description="Please log in to view your borrow requests"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/reader/login">
              <Button type="primary">Log In</Button>
            </Link>
          </div>
        </Card>
      );
    }

    // Create a temporary request from localStorage data if it exists
    const localStorageRequest = selectedBooks ? {
      _id: 'temp-' + Date.now(),
      status: 'pending',
      books: selectedBooks.books || [],
      borrowDate: new Date().toISOString().split('T')[0],
      borrowDuration: 7,
      isLocalStorage: true // Flag to identify this is from localStorage
    } : null;

    // Combine localStorage data with API data
    const allPendingRequests = [
      ...(localStorageRequest ? [localStorageRequest] : []),
      ...requests.filter((req) => req.status === "pending")
    ];
    
    const borrowedRequests = requests.filter(
      (req) => req.status === "borrowed"
    );
    const returnedRequests = requests.filter(
      (req) => req.status === "returned"
    );

    return (
      <div>
        <BorrowTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingRequests={allPendingRequests}
          borrowedRequests={borrowedRequests}
          returnedRequests={returnedRequests}
          loading={loading}
          handleConfirmPickup={handleConfirmPickup}
          handleCancelRequest={handleCancelRequest}
          isLocalStorageRequest={(request) => request.isLocalStorage}
        />

        <div style={{ marginTop: 24 }}>
          <BorrowInfo />
        </div>

        <Modal
          title="Xác nhận yêu cầu mượn sách"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              borrowDate: dayjs(),
              allowedDays: 7,
            }}
          >
            <Form.Item
              name="borrowDate"
              label="Ngày mượn"
              rules={[{ required: true, message: "Vui lòng chọn ngày mượn" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="allowedDays"
              label="Số ngày mượn"
              rules={[
                { required: true, message: "Vui lòng nhập số ngày cho phép" },
              ]}
            >
              <InputNumber min={1} max={30} style={{ width: "100%" }} />
            </Form.Item>

            <div style={{ marginTop: 16 }}>
              <h4>Sách đã chọn:</h4>
              <ul>
                {selectedBooks && selectedBooks.books && selectedBooks.books.map((book) => (
                  <li key={book._id}>{book.name} - {book.author}</li>
                ))}
              </ul>
            </div>
          </Form>
        </Modal>
      </div>
    );
  };

  return (
    <Layout>
      <ReaderNav />
      <Content
        style={{
          padding: "24px",
          backgroundColor: "#f5f5f5",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <Link to="/reader/home">
              <HomeOutlined /> Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <BookOutlined /> Borrow Requests
          </Breadcrumb.Item>
        </Breadcrumb>

        <Title level={2} style={{ marginBottom: 24 }}>
          Yêu cầu mượn sách của tôi
        </Title>

        <Paragraph style={{ marginBottom: 24 }}>
          Quản lý các yêu cầu mượn sách đang chờ và xem sách bạn đã mượn.
          Bạn có thể xác nhận nhận sách hoặc hủy yêu cầu tại đây.
        </Paragraph>

        {renderContent()}
      </Content>
    </Layout>
  );
}
