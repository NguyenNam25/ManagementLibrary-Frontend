import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, Button, Table, message, Modal, Input, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SideNav from "../Layout/SideNav.jsx";
import HeaderComponent from "../Layout/Header.jsx";
import columns from "./columns.jsx";
import bookApi from "../../api/book/index.js";
import majorApi from "../../api/major/index.js";
import BookDetailPopUp from "./BookDetailPopUp.jsx";
const { Title, Text } = Typography; 

export default function BookList() {
  const { Header, Content, Footer } = Layout;
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const buttonUD = (id) => (
    <div className="flex gap-1.5">
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => handleUpdate(id)}
      ></Button>
      <Button
        type="primary"
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(id)}
      ></Button>
    </div>
  );

  const buttonDetail = (book) => (
    <Button
      type="primary"
      icon={<EyeOutlined />}
      onClick={() => {
        setSelectedBook(book);
        setIsModalVisible(true);
      }}
    ></Button>
  );

  const handleUpdate = (id) => {
    navigate(`/book-list/${id}/update`, {
      state: { id },
    });
  };

  const handleDelete = async (id) => {
    try {
      await bookApi.deleteBook(id);
      message.success("Book deleted successfully");
      fetchBooks();
    } catch (error) {
      message.error("Failed to delete book");
      console.error("Error deleting book:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookApi.getAllBooks();

      const booksWithDetails = await Promise.all(
        response.data.map(async (book) => {
          try {
            const [typeResponse, categoryResponse] = await Promise.all([
              majorApi.getTypeById(book.type),
              majorApi.getCategoryById(book.category),
            ]);

            return {
              ...book,
              UD: buttonUD(book._id),
              detail: buttonDetail({
                ...book,
                type: typeResponse.data.name,
                category: categoryResponse.data.name,
              }),
            };
          } catch (error) {
            console.error(
              `Error fetching details for book ${book._id}:`,
              error
            );
            return {
              ...book,
              UD: buttonUD(book._id),
              detail: buttonDetail(book),
            };
          }
        })
      );
      setBooks(booksWithDetails);
    } catch (error) {
      message.error("Failed to fetch books");
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredBooks = books.filter((book) => {
    const searchLower = searchText.toLowerCase();
    return (
      book.id?.toLowerCase().includes(searchLower) ||
      book.name?.toLowerCase().includes(searchLower) ||
      book.quantity?.toString().includes(searchLower) ||
      book.type?.toLowerCase().includes(searchLower) ||
      book.category?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideNav />
      <Layout style={{ background: "#f0f4f7" }}>
        <HeaderComponent title="Quản lý sách" />
        <Content style={{ margin: "0 16px" }}>
          <div style={{ marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0 }}>
              Danh sách sách
            </Title>
            <Text type="secondary">Danh sách các sách trong thư viện</Text>
          </div>
          <Table
            columns={columns}
            dataSource={filteredBooks}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            title={() => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              ><Input
              placeholder="Tìm kiếm sách ..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  
                  <Button
                    type="primary"
                    onClick={() => navigate("/book-list/add")}
                  >
                    + Thêm sách
                  </Button>
                </div>
              </div>
            )}
          />
          <BookDetailPopUp
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            selectedBook={selectedBook}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
