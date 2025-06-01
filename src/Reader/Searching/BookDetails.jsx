import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout, Typography, Row, Col, Breadcrumb, notification, message } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import ReaderNav from "../Layout/ReaderNav";
import bookApi from "../../../api/book";
import majorApi from "../../../api/major";
import borrowTicketApi from "../../../api/borrowticket";

// Import components
import BookCover from "./components/BookCover";
import LibraryInfo from "./components/LibraryInfo";
import BookDetails from "./components/BookDetails";
import BorrowModal from "./components/BorrowModal";
import LoadingState from "./components/LoadingState";
import NotFoundState from "./components/NotFoundState";
import userApi from "../../../api/user";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [category, setCategory] = useState(null);
  const [type, setType] = useState(null);
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [borrowTickets, setBorrowTickets] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await userApi.getCurrentUser();
      setCurrentUser(currentUser.data);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const bookResponse = await bookApi.getBookById(id);
        const bookData = bookResponse.data;

        const [categoryResponse, typeResponse] = await Promise.all([
          majorApi.getCategoryById(bookData.category),
          majorApi.getTypeById(bookData.type),
        ]);

        setBook(bookData);
        setCategory(categoryResponse.data);
        setType(typeResponse.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin sách. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  const handleBorrow = () => {
    console.log("borrowTickets", borrowTickets);
    // Check if user has any pending or borrowed books
    const hasPendingOrBorrowed = borrowTickets.some(ticket => 
      ticket.status === 'pending' || ticket.status === 'borrowed'
    );

    if (hasPendingOrBorrowed) {
      notification.warning({
        message: "Không thể mượn",
        description: "Bạn đã có sách đang mượn hoặc đang chờ xử lý. Vui lòng trả sách trước khi mượn thêm.",
      });
      return;
    }

    setBorrowModalVisible(true);
  };

  const fetchBorrowTickets = async () => {
    try {
      const borrowTickets = await borrowTicketApi.getBorrowTicketByCardNumber(currentUser?.libraryCard?.cardNumber);
      setBorrowTickets(borrowTickets.data);
    } catch (error) {
      console.error("Error fetching borrow tickets:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchBorrowTickets();
  }, [currentUser?.libraryCard?.cardNumber]);

  console.log("borrowTickets", borrowTickets);

  const handleBorrowConfirm = async () => {
    try {
      setConfirmLoading(true);
      const stored = localStorage.getItem("borrowData");
      
      if (stored) {
        const borrowData = JSON.parse(stored);
        // Check if book is already in the list
        const alreadyAdded = borrowData.books.some((b) => b._id === book._id);
        
        if (!alreadyAdded) {
          borrowData.books.push(book);
          localStorage.setItem("borrowData", JSON.stringify(borrowData));
          message.success("Đã thêm sách vào danh sách mượn");
        } else {
          message.error("Sách đã có trong danh sách mượn");
        }
      } else {
        // Create new borrow request if no data exists
        const borrowRequest = {
          cardNumber: currentUser?.libraryCard?.cardNumber,
          books: [book],
          status: "pending",
        };
        localStorage.setItem("borrowData", JSON.stringify(borrowRequest));
        message.success("Đã thêm sách vào danh sách mượn");
      }
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/reader/borrow");
    } catch (error) {
      console.error("Error borrowing book:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể mượn sách. Vui lòng thử lại sau.",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleBorrowMore = async () => {
    // setBorrowModalVisible(true);
    console.log("local storage", localStorage.getItem("borrowData"));
    const stored = localStorage.getItem("borrowData");
    if (stored) {
      const borrowData = JSON.parse(stored);

      // Kiểm tra xem sách đã có trong danh sách chưa
      const alreadyAdded = borrowData.books.some((b) => b._id === book._id);

      if (!alreadyAdded) {
        borrowData.books.push(book);
        localStorage.setItem("borrowData", JSON.stringify(borrowData));
        console.log("Book added to borrowData");
        message.success("Đã thêm sách vào danh sách mượn");
        setBorrowModalVisible(false);
      } else {
        console.log("Book already in borrowData");
        message.error("Sách đã có trong danh sách mượn");
      }
    } else {
      const borrowRequest = {
        cardNumber: currentUser?.libraryCard?.cardNumber,
        books: [book],
        status: "pending",
      };
      localStorage.setItem("borrowData", JSON.stringify(borrowRequest));
      console.log("New borrowData created");
      message.success("Đã thêm sách vào danh sách mượn");
      setBorrowModalVisible(false);
    }
  };
  
  const handleBorrowCancel = () => {
    setBorrowModalVisible(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!book) {
    return <NotFoundState onGoBack={() => navigate(-1)} />;
  }

  return (
    <Layout>
      <div>
        <ReaderNav />
      </div>
      <Content style={{ padding: "24px", backgroundColor: "#f5f5f5" }}>
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            {
              title: (
                <Link to="/reader/home">
                  <HomeOutlined /> Trang chủ
                </Link>
              ),
            },
            {
              title: (
                <Link to="/reader/search">
                  <SearchOutlined /> Tìm kiếm
                </Link>
              ),
            },
            {
              title: book.name,
            },
          ]}
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} lg={6}>
            <BookCover
              book={book}
              isLoggedIn={isLoggedIn}
              onBorrow={handleBorrow}
              currentUser={currentUser}
            />
            <LibraryInfo book={book} />
          </Col>

          <Col xs={24} md={16} lg={18}>
            <BookDetails
              book={book}
              category={category}
              type={type}
              onBorrow={handleBorrow}
            />
          </Col>
        </Row>

        <BorrowModal
          visible={borrowModalVisible}
          onOk={handleBorrowConfirm}
          onBorrowMore={handleBorrowMore}
          onCancel={handleBorrowCancel}
          confirmLoading={confirmLoading}
          book={book}
          category={category}
        />
      </Content>
    </Layout>
  );
};

export default BookDetailsPage;