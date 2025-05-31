import React, { useState, useEffect } from "react";
import { Layout, Card, Col, Row, Space, Tag, Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
  MoreOutlined,
  RiseOutlined,
  FallOutlined,
  StockOutlined,
  UserOutlined,
  BookOutlined,
  ReadOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import MyPieChart from "./PieChart";
import ColumnChart from "./ColumnChart";
import MyLineChart from "./LineChart";
import RadialChart from "./RadialBarChart";
import userApi from "../../api/user";
import borrowTicketApi from "../../api/borrowticket";
import roleApi from "../../api/role";

const { Title, Text } = Typography;

export default function Home() {
  const { Content } = Layout;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsersRegisteredThisMonth: 0,
    totalUsersRegisteredLastMonth: 0,
    totalBorrowsThisMonth: 0,
    totalBorrowsLastMonth: 0,
    userGrowth: 0,
    borrowGrowth: 0,
    totalUsersRegistered: 0,
  });
  const [bookCategoryStats, setBookCategoryStats] = useState([]);
  const [bookBorrowStats, setBookBorrowStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [userRes, borrowRes, roleRes] = await Promise.all([
        userApi.getAllUsers(),
        borrowTicketApi.getAllBorrowTickets(),
        roleApi.getAllRoles(),
      ]);

      const users = userRes.data;
      const borrows = borrowRes.data;
      const roles = roleRes.data;

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

      const isSameMonth = (date, month, year) => {
        const d = new Date(date);
        return d.getMonth() === month && d.getFullYear() === year;
      };

      const readerRole = roles.find((role) => role.name === "reader");

      // Nếu không có role "reader", bỏ qua
      if (!readerRole) {
        console.warn("No role with name 'reader' found");
        return;
      }

      const readers = users.filter(
        (user) => user.status === "active" && user.roleId === readerRole.id
      );

      //reader
      const totalUsersRegistered = readers.length;

      const totalUsersRegisteredThisMonth = readers.filter((user) =>
        isSameMonth(user.createdAt, thisMonth, thisYear)
      ).length;

      const totalUsersRegisteredLastMonth = readers.filter((user) =>
        isSameMonth(user.createdAt, lastMonth, lastMonthYear)
      ).length;

      const userGrowth =
        totalUsersRegisteredLastMonth === 0
          ? 100
          : ((totalUsersRegisteredThisMonth - totalUsersRegisteredLastMonth) /
              totalUsersRegisteredLastMonth) *
            100;

      // Borrows
      const totalBorrowsThisMonth = borrows.filter((borrow) =>
        isSameMonth(borrow.createdAt, thisMonth, thisYear)
      ).length;

      const totalBorrowsLastMonth = borrows.filter((borrow) =>
        isSameMonth(borrow.createdAt, lastMonth, lastMonthYear)
      ).length;

      const borrowGrowth =
        totalBorrowsLastMonth === 0
          ? 100
          : ((totalBorrowsThisMonth - totalBorrowsLastMonth) /
              totalBorrowsLastMonth) *
            100;

      setStats({
        totalUsersRegisteredThisMonth,
        totalUsersRegisteredLastMonth,
        totalBorrowsThisMonth,
        totalBorrowsLastMonth,
        userGrowth: parseFloat(userGrowth.toFixed(2)),
        borrowGrowth: parseFloat(borrowGrowth.toFixed(2)),
        totalUsersRegistered: totalUsersRegistered,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(stats);

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
        <HeaderComponent />
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
              Dashboard
            </Title>
            <Text type="secondary">
              Overview of your library management system
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
                  <UserOutlined style={{ fontSize: "24px", color: "white" }} />
                </Space>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "flex-end",
                  }}
                >
                  <RadialChart value={stats.totalUsersRegistered} />
                  <div style={{ textAlign: "right" }}>
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                      {stats.totalUsersRegistered}
                    </Title>
                    <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      This month
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12} lg={8} xl={8}>
              <Card
                className="dashboard-card"
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
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
                      color: "#52c41a",
                    }}
                  >
                    {stats.borrowGrowth}%{" "}
                    {stats.borrowGrowth >= 0 ? (
                      <RiseOutlined />
                    ) : (
                      <FallOutlined />
                    )}
                  </Tag>
                  <div style={{ textAlign: "right" }}>
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                      {stats.totalBorrows}
                    </Title>
                    <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      Since last month
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
                      width: `${Math.abs(stats.borrowGrowth)}%`,
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
                  <UserOutlined style={{ fontSize: "24px", color: "white" }} />
                </Space>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "flex-end",
                  }}
                >
                  <RadialChart value={stats.userGrowth} />
                  <div style={{ textAlign: "right" }}>
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                      {stats.totalUsersRegistered}
                    </Title>
                    <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      This month
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            

            <Col xs={24} lg={12}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
                title="So nguoi dang ky qua tung nam"
              >
                <ColumnChart data={bookBorrowStats} />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
                title="So luot muon qua tung nam"
              >
                <ColumnChart data={bookBorrowStats} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
