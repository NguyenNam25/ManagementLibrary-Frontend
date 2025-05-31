import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Carousel,
  Button,
  List,
  Divider,
  Spin,
  Menu,
  Dropdown,
  Avatar,
  Space,
} from "antd";
import {
  BookOutlined,
  ReadOutlined,
  FireOutlined,
  ClockCircleOutlined,
  RightOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleFilled,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import ReaderNav from "../Layout/ReaderNav";
import bookApi from "../../../api/book";

const { Content, Header, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function ReaderHome() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  // Demo state to simulate login status - replace with actual auth logic
  
  const fetchPopularBooks = async () => {
    try {
      const response = await bookApi.getPopularBooks();
      setPopularBooks(response.data);
    } catch (error) {
      console.error('Error fetching popular books:', error);
    }
  };

  useEffect(() => {
    fetchPopularBooks();
  }, []);
  
  const fetchBooks = async () => {
    try {
      const response = await bookApi.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchLatestBooks = async () => {
    try {
      const response = await bookApi.getLatestBooks();
      setLatestBooks(response.data);
    } catch (error) {
      console.error('Error fetching latest books:', error); 
    }
  };

  useEffect(() => {
    fetchLatestBooks();
  }, []);
  
  console.log(latestBooks);
  
  return (
    <Layout className="reader-home">
      <ReaderNav />
      <Content
        style={{
          padding: "24px",
          minHeight: "calc(100vh - 64px - 250px)",
          backgroundColor: "#f5f5f5",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Hero Section with Featured Books */}
            <section className="hero-section">
              <Carousel autoplay effect="fade" style={{ marginBottom: 40 }}>
                {popularBooks.map((book) => (
                  <div key={book.id}>
                    <div
                      style={{
                        height: "400px",
                        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${book.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "0 100px",
                        borderRadius: "8px",
                      }}
                    >
                      <Title
                        level={1}
                        style={{ color: "white", marginBottom: 10 }}
                      >
                        {book.name}
                      </Title>
                      <Title
                        level={3}
                        style={{
                          color: "white",
                          marginTop: 0,
                          marginBottom: 20,
                        }}
                      >
                        {book.author}
                      </Title>
                      <Link to={`/reader/book/${book.id}`}>
                        <Button size="large" type="primary">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </Carousel>
            </section>

            {/* New Arrivals */}
            <section className="new-arrivals">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Title level={2}>
                  <ClockCircleOutlined /> New Arrivals
                </Title>
                <Link to="/reader/search">
                  <Button type="link">
                    View All <RightOutlined />
                  </Button>
                </Link>
              </div>
              <Row gutter={[16, 16]}>
                {latestBooks.map((book) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                    <Link to={`/reader/book/${book._id}`}>
                      <Card
                        hoverable
                        cover={
                          <div style={{ height: 250, overflow: "hidden" }}>
                            <img
                              alt={book.name}
                              src={book.image}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        }
                      >
                        <Card.Meta
                          title={book.name}
                          description={book.author}
                        />
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </section>

            <Divider />

            {/* Popular Books */}
            <section className="popular-books">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Title level={2}>
                  <FireOutlined /> Popular Books
                </Title>
                <Link to="/reader/search">
                  <Button type="link">
                    View All <RightOutlined />
                  </Button>
                </Link>
              </div>
              <Row gutter={[16, 16]}>
                {popularBooks.map((book) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                    <Link to={`/reader/book/${book.id}`}>
                      <Card
                        hoverable
                        cover={
                          <div style={{ height: 250, overflow: "hidden" }}>
                            <img
                              alt={book.name}
                              src={book.image}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        }
                      >
                        <Card.Meta
                          title={book.name}
                          description={book.author}
                        />
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </section>
          </>
        )}
      </Content>
      <Footer
        style={{
          backgroundColor: "#001529",
          padding: "40px 50px",
          color: "rgba(255, 255, 255, 0.65)",
        }}
      >
        <Row gutter={[32, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "white", marginBottom: "20px" }}>
              About Library
            </Title>
            <Paragraph style={{ color: "rgba(255, 255, 255, 0.65)" }}>
              Our library provides access to a vast collection of books,
              journals, and digital resources. We are committed to fostering
              learning, creativity, and community engagement through our
              services.
            </Paragraph>
            <Space size="large" style={{ marginTop: "20px" }}>
              <Button
                type="text"
                shape="circle"
                icon={
                  <FacebookOutlined
                    style={{
                      color: "rgba(255, 255, 255, 0.65)",
                      fontSize: "20px",
                    }}
                  />
                }
              />
              <Button
                type="text"
                shape="circle"
                icon={
                  <TwitterOutlined
                    style={{
                      color: "rgba(255, 255, 255, 0.65)",
                      fontSize: "20px",
                    }}
                  />
                }
              />
              <Button
                type="text"
                shape="circle"
                icon={
                  <InstagramOutlined
                    style={{
                      color: "rgba(255, 255, 255, 0.65)",
                      fontSize: "20px",
                    }}
                  />
                }
              />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "white", marginBottom: "20px" }}>
              Opening Hours
            </Title>
            <List
              itemLayout="horizontal"
              dataSource={[
                { day: "Monday - Friday", hours: "9:00 AM - 9:00 PM" },
                { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
                { day: "Sunday", hours: "12:00 PM - 5:00 PM" },
              ]}
              renderItem={(item) => (
                <List.Item style={{ border: "none", padding: "8px 0" }}>
                  <List.Item.Meta
                    avatar={
                      <ClockCircleFilled
                        style={{ color: "rgba(255, 255, 255, 0.65)" }}
                      />
                    }
                    title={<span style={{ color: "white" }}>{item.day}</span>}
                    description={
                      <span style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                        {item.hours}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "white", marginBottom: "20px" }}>
              Contact Information
            </Title>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  icon: <EnvironmentOutlined />,
                  content: "123 Library Street, Academic City, 10001",
                },
                {
                  icon: <PhoneOutlined />,
                  content: "(123) 456-7890",
                },
                {
                  icon: <MailOutlined />,
                  content: "info@libraryreader.com",
                },
              ]}
              renderItem={(item) => (
                <List.Item style={{ border: "none", padding: "8px 0" }}>
                  <Space>
                    {React.cloneElement(item.icon, {
                      style: { color: "rgba(255, 255, 255, 0.65)" },
                    })}
                    <span style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                      {item.content}
                    </span>
                  </Space>
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <Divider
          style={{
            borderColor: "rgba(255, 255, 255, 0.15)",
            margin: "24px 0 16px",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <Text style={{ color: "rgba(255, 255, 255, 0.45)" }}>
            © {new Date().getFullYear()} Library Reader Management System. All
            rights reserved.
          </Text>
        </div>
      </Footer>
    </Layout>
  );
}
