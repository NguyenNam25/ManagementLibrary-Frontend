import React, { useState, useEffect } from "react";
import { Layout, Card, Col, Row, Space, Tag, Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
  RiseOutlined,
  FallOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import MyPieChart from "./PieChart";
import ColumnChart from "./ColumnChart";
import userApi from "../../api/user";
import borrowTicketApi from "../../api/borrowticket";
import roleApi from "../../api/role";
import majorApi from "../../api/major";
const { Title, Text } = Typography;

export default function Home() {
  const { Content } = Layout;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookCategoryStats, setBookCategoryStats] = useState([]);
  const [bookBorrowStats, setBookBorrowStats] = useState([]);
  const [bookBorrowStatsMonthly, setBookBorrowStatsMonthly] = useState([]);
  const [registeredUserStats, setRegisteredUserStats] = useState([]);
  const [blockUserStats, setBlockUserStats] = useState([]);

  const fetchBookBorrowStatsMonthly = async () => {
    try {
      setLoading(true);
      const response = await borrowTicketApi.getAllBorrowTickets();
      const borrows = response.data;
      // Create an array of months with their borrow counts
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const currentYear = new Date().getFullYear();
      const monthlyStats = monthNames.map((month, index) => {
        const monthBorrows = borrows.filter((borrow) => {
          const borrowDate = new Date(borrow.createdAt);
          return (
            borrowDate.getMonth() === index &&
            borrowDate.getFullYear() === currentYear
          );
        });

        return {
          name: month,
          borrowCount: monthBorrows.length,
        };
      });

      setBookBorrowStatsMonthly(monthlyStats);
    } catch (error) {
      console.error("Error fetching book borrow stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookBorrowStats = async () => {
    try {
      setLoading(true);
      const response = await borrowTicketApi.getAllBorrowTickets();
      const borrows = response.data;

      const now = new Date();
      const thisMonth = now.getMonth() + 1;
      const thisYear = now.getFullYear();
      const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
      const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;

      const isSameMonth = (date, month, year) => {
        const d = new Date(date);
        return d.getMonth() === month - 1 && d.getFullYear() === year;
      };

      // Get borrows for this month and last month
      const thisMonthBorrows = borrows.filter((borrow) =>
        isSameMonth(borrow.createdAt, thisMonth, thisYear)
      );

      const lastMonthBorrows = borrows.filter((borrow) =>
        isSameMonth(borrow.createdAt, lastMonth, lastMonthYear)
      );

      // Create stats for both months
      const monthlyStats = [
        {
          name: "This Month",
          borrowCount: thisMonthBorrows.length,
          month: thisMonth,
          year: thisYear,
        },
        {
          name: "Last Month",
          borrowCount: lastMonthBorrows.length,
          month: lastMonth,
          year: lastMonthYear,
        },
      ];

      setBookBorrowStats(monthlyStats);
    } catch (error) {
      console.error("Error fetching book borrow stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatgoryPopularity = async () => {
    try {
      setLoading(true);
      const response = await majorApi.getAllCategories();
      setBookCategoryStats(response.data);
    } catch (error) {
      console.error("Error fetching category popularity:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredUserStats = async () => {
    try {
      setLoading(true);
      const [userRes, roleRes] = await Promise.all([
        userApi.getAllUsers(),
        roleApi.getAllRoles(),
      ]);

      const users = userRes.data;
      const roles = roleRes.data;

      // Find reader role
      const readerRole = roles.find((role) => role.name === "reader");
      if (!readerRole) {
        console.warn("No role with name 'reader' found");
        return;
      }

      // Filter active readers
      const readers = users.filter(
        (user) => user.status === "active" && user.roleId === readerRole.id
      );

      const now = new Date();
      const thisMonth = now.getMonth() + 1;
      const thisYear = now.getFullYear();
      const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
      const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;

      const isSameMonth = (date, month, year) => {
        const d = new Date(date);
        return d.getMonth() === month - 1 && d.getFullYear() === year;
      };

      // Get registrations for this month and last month
      const thisMonthRegistrations = readers.filter((user) =>
        isSameMonth(user.createdAt, thisMonth, thisYear)
      );

      const lastMonthRegistrations = readers.filter((user) =>
        isSameMonth(user.createdAt, lastMonth, lastMonthYear)
      );

      // Create stats for both months
      const monthlyStats = [
        {
          name: "This Month",
          registrationCount: thisMonthRegistrations.length,
          month: thisMonth,
          year: thisYear,
        },
        {
          name: "Last Month",
          registrationCount: lastMonthRegistrations.length,
          month: lastMonth,
          year: lastMonthYear,
        },
      ];

      setRegisteredUserStats(monthlyStats);
    } catch (error) {
      console.error("Error fetching registered user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockUserStats = async () => {
    try {
      const [userRes, roleRes] = await Promise.all([
        userApi.getAllUsers(),
        roleApi.getAllRoles(),
      ]);

      const users = userRes.data;
      const roles = roleRes.data;

      // Find reader role
      const readerRole = roles.find((role) => role.name === "reader");
      if (!readerRole) {
        console.warn("No role with name 'reader' found");
        return;
      }

      // Filter blocked readers
      const blockedReaders = users.filter(
        (user) => user.status === "blocked" && user.roleId === readerRole.id
      );

      const now = new Date();
      const thisMonth = now.getMonth() + 1;
      const thisYear = now.getFullYear();
      const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
      const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;

      const isSameMonth = (date, month, year) => {
        const d = new Date(date);
        return d.getMonth() === month - 1 && d.getFullYear() === year;
      };

      // Get blocked users for this month and last month
      const thisMonthBlocked = blockedReaders.filter((user) =>
        isSameMonth(user.updatedAt, thisMonth, thisYear)
      );

      const lastMonthBlocked = blockedReaders.filter((user) =>
        isSameMonth(user.updatedAt, lastMonth, lastMonthYear)
      );

      // Create stats for both months
      const monthlyStats = [
        {
          name: "This Month",
          blockCount: thisMonthBlocked.length,
          month: thisMonth,
          year: thisYear,
        },
        {
          name: "Last Month",
          blockCount: lastMonthBlocked.length,
          month: lastMonth,
          year: lastMonthYear,
        },
      ];

      setBlockUserStats(monthlyStats);
    } catch (error) {
      console.error("Error fetching blocked user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatgoryPopularity();
    fetchBookBorrowStats();
    fetchBookBorrowStatsMonthly();
    fetchRegisteredUserStats();
    fetchBlockUserStats();
  }, []);

  console.log(bookBorrowStats)
  console.log(registeredUserStats)
  console.log(blockUserStats)

  const calculateGrowth = (stats, field) => {
    if (!stats || stats.length < 2) return 0;
  
    const current = stats[0]?.[field] ?? 0;
    const previous = stats[1]?.[field] ?? 0;
  
    if (previous === 0) return current === 0 ? 0 : 100;
  
    return (((current - previous) / previous) * 100).toFixed(2);
  };
  
  const borrowGrowth = calculateGrowth(bookBorrowStats, "borrowCount");
  const registeredUserGrowth = calculateGrowth(registeredUserStats, "registrationCount");
  const blockUserGrowth = calculateGrowth(blockUserStats, "blockCount");

  console.log(borrowGrowth)
  console.log(registeredUserGrowth)

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", width: "100vw" }}>
        <SideNav />
        <Layout style={{ background: "#f0f4f7", width: "100%" }}>
          <HeaderComponent />
          <Content
            style={{
              margin: 0,
              padding: "24px",
              minHeight: "calc(100vh - 64px)",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <SideNav />
      <Layout style={{ background: "#f0f4f7", width: "100%" }}>
        <HeaderComponent title="Trang chủ" />
        <Content
          style={{
            margin: 0,
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
            width: "100%",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0 }}>
              Thống kê số liệu
            </Title>
            <Text type="secondary">
              Tổng quan về hệ thống quản lý thư viện
            </Text>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={8} xl={8}>
              <Card
                className="dashboard-card"
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                  color: "white",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    Số người đăng ký
                  </Title>
                  <ReadOutlined style={{ fontSize: "24px", color: "white" }} />
                </Space>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Tag
                    color="white"
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      color: registeredUserGrowth >= 0 ? "#52c41a" : "#ff4d4f",
                    }}
                  >
                    {Math.abs(registeredUserGrowth)}%{" "}
                    {registeredUserGrowth >= 0 ? (
                      <RiseOutlined />
                    ) : (
                      <FallOutlined />
                    )}
                  </Tag>
                  <div style={{ textAlign: "right" }}>
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                      {registeredUserStats?.[0]?.registrationCount || 0}
                    </Title>
                    <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      Tháng này
                    </Text>
                  </div>
                </Space>
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "2px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.abs(borrowGrowth)}%`,
                      height: "100%",
                      background: "white",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12} lg={8} xl={8}>
              <Card
                className="dashboard-card"
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  background: "linear-gradient(135deg, #13c2c2 0%, #08979c 100%)",
                  color: "white",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    Số lượt mượn
                  </Title>
                  <ReadOutlined style={{ fontSize: "24px", color: "white" }} />
                </Space>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Tag
                    color="white"
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      color: borrowGrowth >= 0 ? "#52c41a" : "#ff4d4f",
                    }}
                  >
                    {Math.abs(borrowGrowth)}%{" "}
                    {borrowGrowth >= 0 ? (
                      <RiseOutlined />
                    ) : (
                      <FallOutlined />
                    )}
                  </Tag>
                  <div style={{ textAlign: "right" }}>
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                      {bookBorrowStats?.[1]?.borrowCount || 0}
                    </Title>
                    <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      Tháng này
                    </Text>
                  </div>
                </Space>
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "2px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.abs(borrowGrowth)}%`,
                      height: "100%",
                      background: "white",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12} lg={8} xl={8}>
              <Card
                className="dashboard-card"
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  background: "linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)",
                  color: "white",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    Số người vi phạm mượn trả
                  </Title>
                  <ReadOutlined style={{ fontSize: "24px", color: "white" }} />
                </Space>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Tag
                    color="white"
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      color: blockUserGrowth >= 0 ? "#52c41a" : "#ff4d4f",
                    }}
                  >
                    {Math.abs(blockUserGrowth)}%{" "}
                    {blockUserGrowth >= 0 ? (
                      <RiseOutlined />
                    ) : (
                      <FallOutlined />
                    )}
                  </Tag>
                  <div style={{ textAlign: "right" }}>
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                      {blockUserStats?.[0]?.blockCount || 0}
                    </Title>
                    <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      Tháng này
                    </Text>
                  </div>
                </Space>
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "2px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.abs(blockUserGrowth)}%`,
                      height: "100%",
                      background: "white",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            <Col xs={24} lg={12}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  background: "white",
                }}
                title={
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1890ff" }}>
                    Thể loại sách người mượn quan tâm
                  </div>
                }
              >
                <MyPieChart data={bookCategoryStats} />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  background: "white",
                }}
                title={
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "#13c2c2" }}>
                    Số lượt mượn qua từng tháng
                  </div>
                }
              >
                <ColumnChart data={bookBorrowStatsMonthly} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
