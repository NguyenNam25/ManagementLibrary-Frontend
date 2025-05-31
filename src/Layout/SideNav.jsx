import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  ReadOutlined,
  ProfileOutlined,
  SolutionOutlined,
  TeamOutlined,
  FileAddOutlined,
  ScheduleOutlined,
  ClockCircleOutlined,
  BankOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import userApi from "../../api/user";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Dashboard", "/home", <DashboardOutlined />),
  getItem("Book", "1", <BookOutlined />, [
    getItem("Add Book", "/book-list/add", <FileAddOutlined />),
    getItem("Major Manage", "/major-manage", <BookOutlined />),
    getItem("Book List", "/book-list", <ProfileOutlined />),
  ]),
  getItem("Rules and service", "/rules", <InfoCircleOutlined />),
  getItem("Borrows and Returns", "9", <ReadOutlined />, [
    getItem("Waiting List", "/waiting-borrow-list", <ClockCircleOutlined />),
    getItem("Borrow List", "/borrow-ticket", <ScheduleOutlined />),
  ]),
  getItem("Member", "8", <TeamOutlined />, [
    getItem("Pending Requests", "/waiting-member", <ClockCircleOutlined />),
    getItem("Create Account", "/manager/account-create", <UserAddOutlined />),
    getItem("Manager List", "/manager-list", <SolutionOutlined />),
    getItem("Reader List", "/reader-list", <SolutionOutlined />),
  ]),
  getItem("Library information", "/library-info", <BankOutlined />),
];
export default function SideNav() {
  const { Sider } = Layout;
  const navigate = useNavigate();
  const [libInfo, setLibInfo] = useState(null);

  const fetchLibraryInfo = async () => {
    const response = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
    setLibInfo(response.data.abouts);
  };
  
  useEffect(() => {
    fetchLibraryInfo();
  }, []);
  
  const logo = libInfo?.find((item) => item.name === "Logo")?.detail;

  const handleMenuOnClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      theme="dark"
      width={250}
      style={{ 
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "auto"
      }}
      className="sider"
    >
      <img
        src={logo}
        alt="Library Logo"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          margin: "16px auto",
          display: "block"
        }}
      />
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        onClick={handleMenuOnClick}
        style={{
          border: "none",
          padding: "0 0px"
        }}
      />
    </Sider>
  );
}
