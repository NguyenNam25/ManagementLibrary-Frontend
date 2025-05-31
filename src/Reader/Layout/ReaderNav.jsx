import React, { useState, useEffect } from "react";
import { Layout, Button, Menu, Dropdown, Avatar, Space } from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  DownOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../../../api/user";
import { NavMenuItems } from "./NavMenuItems";

const { Header } = Layout;

export default function ReaderNav() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const response = await userApi.getCurrentUser();
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    // Clear user info from localStorage
    await userApi.logout();
    navigate("/reader/login");
  };

  // Account dropdown menu items
  const userMenuItems = [
    {
      key: "1",
      label: "My Account",
      icon: <UserOutlined />,
      onClick: () => navigate("/reader/account"),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const renderUserActions = () => {
    if (currentUser !== null) {
      return (
        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <Space className="user-dropdown" style={{ cursor: "pointer" }}>
            <Avatar
              style={{ backgroundColor: "#1890ff" }}
              icon={<UserOutlined />}
            />
            <span style={{ marginLeft: "8px" }}>{currentUser?.fullName}</span>
            <DownOutlined style={{ fontSize: "12px" }} />
          </Space>
        </Dropdown>
      );
    } else {
      return (
        <>
          <Link to="/reader/login">
            <Button
              type="primary"
              icon={<LoginOutlined />}
              style={{ marginRight: "10px" }}
            >
              Login
            </Button>
          </Link>
          <Link to="/reader/signup">
            <Button icon={<UserOutlined />}>Sign Up</Button>
          </Link>
        </>
      );
    }
  };

  return (
    <Layout>
      <Header
        style={{
          background: "#fff",
          padding: "0 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1 style={{ margin: "0 20px 0 0", fontSize: "24px" }}>Library</h1>
            <Menu
              mode="horizontal"
              items={NavMenuItems}
              style={{ border: "none", minWidth: "700px" }}
            />
          </div>
          <div>{renderUserActions()}</div>
        </div>
      </Header>
    </Layout>
  );
}
