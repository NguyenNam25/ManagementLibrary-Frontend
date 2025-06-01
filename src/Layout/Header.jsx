import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Layout,
  Input,
  Button,
  Avatar,
  Dropdown,
  Menu,
  Space,
  message
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  BellOutlined,
  MoonOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import userApi from "../../api/user";

export default function HeaderComponent(props) {
  const { Header } = Layout;
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const fetchCurrentUser = async () => {
    try {
      const response = await userApi.getCurrentUser();
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await userApi.logout();
      message.success('Logged out successfully');
      // Navigate to login page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Failed to logout. Please try again.');
    }
  };

  const handleProfile = () => { 
    navigate("/account");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={handleProfile}>
        Tài khoản của tôi
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const userInitial = currentUser?.fullName?.charAt(0).toUpperCase();

  return (
    <Header
      style={{
        height: "auto",
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 32px",
        background: "#f0f4f7",
      }}
    >
      <h1 className="text-2xl ">{props.title}</h1>
      <div className="flex gap-3 justify-center">
        
        <Button
          ghost
          size="large"
          icon={<BellOutlined />}
          style={{ border: "none", color: "black" }}
        ></Button>
        <Button
          ghost
          size="large"
          icon={<MoonOutlined />}
          style={{ border: "none", color: "black" }}
        ></Button>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Space>
            <div className="flex items-center h-[35px] gap-2 hover:bg-[#d8f8ca] rounded-2xl cursor-pointer">
              <Avatar
                style={{ backgroundColor: "#87d068", width: 35, height: 35 }}
              >
                {userInitial}
              </Avatar>
              <h2 className="w-20">{currentUser?.fullName}</h2>
            </div>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
}
