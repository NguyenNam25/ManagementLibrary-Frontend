import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Button,
  Select,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  List,
  Space,
  Tag,
  Pagination,
  Empty,
  Spin,
  Checkbox,
  Radio,
  Collapse,
  message,
} from "antd";
import {
  SearchOutlined,
  BookOutlined,
  FilterOutlined,
  AuditOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  SortAscendingOutlined,
  HeartOutlined,
  HeartFilled
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ReaderNav from "../Layout/ReaderNav";
import bookApi from "../../../api/book";
import majorApi from "../../../api/major";
import userApi from "../../../api/user";

const { Title, Text, Paragraph } = Typography;
const { Header, Content, Sider } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

export default function Searching() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    categories: [],
    types: [],
    years: [],
    availability: "all",
    interested: false
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [interestedBooks, setInterestedBooks] = useState([]);
  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksResponse, categoriesResponse, typesResponse] = await Promise.all([
          bookApi.getAllBooks(),
          majorApi.getAllCategories(),
          majorApi.getAllTypes()
        ]);

        setBooks(booksResponse.data);
        setCategories(categoriesResponse.data);
        setTypes(typesResponse.data);
        setTotal(booksResponse.data.length);
      } catch (error) {
        message.error("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userApi.getCurrentUser();
        setCurrentUser(response.data);
        if (response.data) {
          setInterestedBooks(response.data.interestedBook || []);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Filtered and sorted books based on search and filters
  const filteredBooks = books.filter(book => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesCategories = filters.categories.length === 0 || 
      filters.categories.includes(book.category);
    
    // Type filter
    const matchesTypes = filters.types.length === 0 || 
      filters.types.includes(book.type);
    
    // Year filter
    const matchesYears = filters.years.length === 0 || 
      filters.years.includes(book.yearOfPublication);
    
    // Availability filter
    const matchesAvailability = 
      filters.availability === "all" || 
      (filters.availability === "available" && book.status === "available");

    // Interested filter
    const matchesInterested = !filters.interested || interestedBooks.includes(book._id);
    
    return matchesSearch && matchesCategories && matchesTypes && matchesYears && matchesAvailability && matchesInterested;
  });

  // Sort books based on selected sort option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "title_asc":
        return a.name.localeCompare(b.name);
      case "title_desc":
        return b.name.localeCompare(a.name);
      case "author_asc":
        return a.author.localeCompare(b.author);
      case "author_desc":
        return b.author.localeCompare(a.author);
      case "year_asc":
        return a.yearOfPublication - b.yearOfPublication;
      case "year_desc":
        return b.yearOfPublication - a.yearOfPublication;
      default: // relevance
        return 0;
    }
  });

  // Paginated books
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Get unique years for filter options
  const allYears = Array.from(
    new Set(books.map(book => book.yearOfPublication))
  ).sort((a, b) => b - a);

  const handleSearch = value => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = checkedValues => {
    setFilters({ ...filters, categories: checkedValues });
    setCurrentPage(1);
  };

  const handleTypeChange = checkedValues => {
    setFilters({ ...filters, types: checkedValues });
    setCurrentPage(1);
  };

  const handleYearChange = checkedValues => {
    setFilters({ ...filters, years: checkedValues });
    setCurrentPage(1);
  };

  const handleAvailabilityChange = e => {
    setFilters({ ...filters, availability: e.target.value });
    setCurrentPage(1);
  };

  const handleSortChange = value => {
    setSortBy(value);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInterestedFilterChange = e => {
    setFilters({ ...filters, interested: e.target.checked });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      types: [],
      years: [],
      availability: "all",
      interested: false
    });
    setSortBy("relevance");
    setCurrentPage(1);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const handleInterested = async (book) => {
    if (!currentUser) {
      message.warning('Please login to add books to your interested list');
      return;
    }

    try {
      const isInterested = interestedBooks.includes(book._id);
      if (isInterested) {
        await userApi.deleteUserInterestedBook(currentUser._id, book._id);
        setInterestedBooks(interestedBooks.filter(id => id !== book._id));
        message.success('Book removed from interested list');
      } else {
        await userApi.updateUserInterestedBook(currentUser._id, { bookId: book._id });
        setInterestedBooks([...interestedBooks, book._id]);
        message.success('Book added to interested list');
      }
    } catch (error) {
      console.error('Error updating interested book:', error);
      message.error('Failed to update interested book list');
    }
  };

  // Render book items
  const renderBookItem = book => {
    const category = categories.find(c => c._id === book.category);
    const type = types.find(t => t._id === book.type);
    const isInterested = interestedBooks.includes(book._id);

    if (viewMode === "grid") {
      return (
        <Col xs={24} sm={12} md={8} lg={6} key={book._id}>
          <Link to={`/reader/book/${book._id}`} style={{ display: 'block' }}>
            <Card
              hoverable
              cover={
                <div style={{ height: 250, overflow: "hidden" }}>
                  <img
                    alt={book.name}
                    src={book.image || "https://via.placeholder.com/300x400?text=No+Image"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              }
              actions={[
                <Button 
                  type={isInterested ? "primary" : "default"}
                  icon={isInterested ? <HeartFilled /> : <HeartOutlined />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleInterested(book);
                  }}
                >
                  {isInterested ? "Xóa" : "Thêm"}
                </Button>
              ]}
            >
              <Card.Meta
                title={book.name}
                description={
                  <>
                    <Text>{book.author} ({book.yearOfPublication})</Text>
                    <div style={{ marginTop: 8 }}>
                      {book.status === "available" ? (
                        <Tag color="success">Có sẵn</Tag>
                      ) : (
                        <Tag color="error">Đã mượn</Tag>
                      )}
                    </div>
                  </>
                }
              />
            </Card>
          </Link>
        </Col>
      );
    } else {
      return (
        <Col span={24} key={book._id}>
          <Link to={`/reader/book/${book._id}`} style={{ display: 'block' }}>
            <Card hoverable>
              <div style={{ display: "flex" }}>
                <div style={{ width: 120, marginRight: 20 }}>
                  <img
                    alt={book.name}
                    src={book.image || "https://via.placeholder.com/300x400?text=No+Image"}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Title level={4}>{book.name}</Title>
                    <Button 
                      type={isInterested ? "primary" : "default"}
                      icon={isInterested ? <HeartFilled /> : <HeartOutlined />}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleInterested(book);
                      }}
                    >
                      {isInterested ? "Xóa" : "Thêm"}
                    </Button>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <Text strong>Tác giả:</Text> {book.author} | <Text strong>Năm:</Text> {book.yearOfPublication}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    {category && <Tag>{category.name}</Tag>}
                    {type && <Tag>{type.name}</Tag>}
                  </div>
                  <Paragraph ellipsis={{ rows: 2 }}>{book.description}</Paragraph>
                  <div>
                    {book.status === "available" ? (
                      <Tag color="success">Có sẵn</Tag>
                    ) : (
                      <Tag color="error">Đã mượn</Tag>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </Col>
      );
    }
  };

  return (
    <Layout className="search-layout" style={{ minHeight: "100vh" }}>
      <ReaderNav />
      <Layout>
        <Header 
          style={{ 
            background: "white", 
            padding: "16px 16px 0px 16px", 
            height: "auto",
            position: "sticky",
            top: 0,
            zIndex: 1
          }}
        >
          <Search
            placeholder="Tìm kiếm theo tên sách, tác giả hoặc từ khóa..."
            size="large"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "100%" }}
          />
        </Header>
        <Layout style={{ background: "white" }}>
          <Sider 
            width={280} 
            theme="light"
            style={{ 
              padding: "20px",
              overflowY: "auto",
              height: "calc(100vh - 64px - 64px)",
              position: "sticky",
              top: 64,
              left: 0,
              background: "white"
            }}
          >
            <div 
              style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: 16
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                <FilterOutlined /> Bộ lọc
              </Title>
              <Button type="link" onClick={resetFilters}>Đặt lại tất cả</Button>
            </div>
            
            <Divider style={{ margin: "12px 0" }} />
            
            <Collapse defaultActiveKey={['1', '2', '3', '4', '5']} ghost>
              <Panel header={<Title level={5} style={{ margin: 0 }}><HeartOutlined /> Sách quan tâm</Title>} key="5">
                <Checkbox
                  checked={filters.interested}
                  onChange={handleInterestedFilterChange}
                  disabled={!currentUser}
                >
                  Chỉ hiện sách đã quan tâm
                </Checkbox>
                {!currentUser && (
                  <div style={{ marginTop: 8, color: '#999' }}>
                    <Text type="secondary">Vui lòng đăng nhập để sử dụng bộ lọc này</Text>
                  </div>
                )}
              </Panel>
              
              <Panel header={<Title level={5} style={{ margin: 0 }}><TagsOutlined /> Thể loại</Title>} key="1">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={filters.categories}
                  onChange={handleCategoryChange}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {categories.map(category => (
                      <Checkbox key={category._id} value={category._id}>
                        {category.name}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Panel>
              
              <Panel header={<Title level={5} style={{ margin: 0 }}><TagsOutlined /> Loại sách</Title>} key="2">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={filters.types}
                  onChange={handleTypeChange}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {types.map(type => (
                      <Checkbox key={type._id} value={type._id}>
                        {type.name}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Panel>
              
              <Panel header={<Title level={5} style={{ margin: 0 }}><BookOutlined /> Năm xuất bản</Title>} key="3">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={filters.years}
                  onChange={handleYearChange}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {allYears.map(year => (
                      <Checkbox key={year} value={year}>
                        {year}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Panel>
              
              <Panel header={<Title level={5} style={{ margin: 0 }}>Tình trạng</Title>} key="4">
                <Radio.Group
                  value={filters.availability}
                  onChange={handleAvailabilityChange}
                >
                  <Space direction="vertical">
                    <Radio value="all">Tất cả</Radio>
                    <Radio value="available">Có sẵn</Radio>
                  </Space>
                </Radio.Group>
              </Panel>
            </Collapse>
          </Sider>
          
          <Content style={{ 
            padding: "20px", 
            minHeight: "calc(100vh - 64px - 64px)",
            background: "#f5f5f5"
          }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "100px 0" }}>
                <Spin size="large" />
                <div style={{ marginTop: 20 }}>Đang tải sách...</div>
              </div>
            ) : (
              <>
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: 20,
                    background: "white",
                    padding: "16px",
                    borderRadius: "8px"
                  }}
                >
                  <div>
                    <Text>
                      Hiển thị {paginatedBooks.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
                      {Math.min(currentPage * pageSize, filteredBooks.length)} trong tổng số {filteredBooks.length} kết quả
                    </Text>
                  </div>
                  <Space>
                    <Select
                      value={sortBy}
                      onChange={handleSortChange}
                      style={{ width: 180 }}
                      placeholder="Sắp xếp theo"
                    >
                      <Option value="relevance">Liên quan</Option>
                      <Option value="title_asc">Tên sách (A-Z)</Option>
                      <Option value="title_desc">Tên sách (Z-A)</Option>
                      <Option value="author_asc">Tác giả (A-Z)</Option>
                      <Option value="author_desc">Tác giả (Z-A)</Option>
                      <Option value="year_asc">Năm (Cũ nhất)</Option>
                      <Option value="year_desc">Năm (Mới nhất)</Option>
                    </Select>
                    <Button 
                      icon={viewMode === "grid" ? <UnorderedListOutlined /> : <AppstoreOutlined />} 
                      onClick={toggleViewMode}
                    >
                      {viewMode === "grid" ? "Chế độ danh sách" : "Chế độ lưới"}
                    </Button>
                  </Space>
                </div>
                
                {paginatedBooks.length > 0 ? (
                  <>
                    <Row gutter={[16, 16]}>
                      {paginatedBooks.map(book => renderBookItem(book))}
                    </Row>
                    
                    <div style={{ textAlign: "center", marginTop: 40 }}>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredBooks.length}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                      />
                    </div>
                  </>
                ) : (
                  <Empty
                    description={
                      <div>
                        <p>Không tìm thấy sách phù hợp với tiêu chí tìm kiếm.</p>
                        <p>Vui lòng điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
                      </div>
                    }
                  />
                )}
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
