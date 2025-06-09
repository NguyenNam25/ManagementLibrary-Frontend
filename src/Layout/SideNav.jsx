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
import roleApi from "../../api/role";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// const items = [
//   getItem("Trang chủ", "/home", <DashboardOutlined />),
//   getItem("Quản lý sách", "1", <BookOutlined />, [
//     getItem("Thêm sách", "/book-list/add", <FileAddOutlined />),
//     getItem("Quản lý chuyên ngành", "/major-manage", <BookOutlined />),
//     getItem("Danh sách sách", "/book-list", <ProfileOutlined />),
//   ]),
//   getItem("Quy định và dịch vụ", "/rules", <InfoCircleOutlined />),
//   getItem("Mượn và trả sách", "9", <ReadOutlined />, [
//     getItem("Danh sách chờ", "/waiting-borrow-list", <ClockCircleOutlined />),
//     getItem("Danh sách mượn", "/borrow-ticket", <ScheduleOutlined />),
//   ]),
//   getItem("Quản lý thành viên", "8", <TeamOutlined />, [
//     getItem("Yêu cầu chờ", "/waiting-member", <ClockCircleOutlined />),
//     getItem("Tạo tài khoản", "/manager/account-create", <UserAddOutlined />),
//     getItem("Danh sách quản lý", "/manager-list", <SolutionOutlined />),
//     getItem("Danh sách thành viên", "/reader-list", <SolutionOutlined />),
//   ]),
//   getItem("Thông tin thư viện", "/library-info", <BankOutlined />),
// ];

const getMenuItemsByRole = (role) => {
  const commonItems = [
    getItem("Trang chủ", "/home", <DashboardOutlined />),
    
  ];

  const libraryInfoManage = [
    getItem("Quy định và dịch vụ", "/rules", <InfoCircleOutlined />),
    getItem("Thông tin thư viện", "/library-info", <BankOutlined />),
  ];

  const getBookManage = (role) => {
    const baseItem = getItem("Danh sách sách", "/book-list", <ProfileOutlined />);

    if (role === "admin") {
      return getItem("Quản lý sách", "book-manage", <BookOutlined />, [
        baseItem,
        getItem("Thêm sách", "/book-list/add", <FileAddOutlined />),
        getItem("Quản lý chuyên ngành", "/major-manage", <BookOutlined />),  
      ]);
    } 

    return baseItem;
  };

  const borrowManage = getItem("Mượn và trả sách", "borrow-manage", <ReadOutlined />, [
    getItem("Danh sách chờ", "/waiting-borrow-list", <ClockCircleOutlined />),
    getItem("Danh sách mượn", "/borrow-ticket", <ScheduleOutlined />),
  ]);

  const getUserManage = (role) => {
    const baseItem = [getItem("Yêu cầu chờ", "/waiting-member", <ClockCircleOutlined />),  getItem("Danh sách thành viên", "/reader-list", <SolutionOutlined />), ];
    if (role === "admin") {
      return getItem("Quản lý thành viên", "user-manage", <TeamOutlined />, [
        ...baseItem,
        getItem("Danh sách quản lý", "/manager-list", <SolutionOutlined />),
        getItem("Tạo tài khoản", "/manager/account-create", <UserAddOutlined />),
      ]);
    }
    else {
      return baseItem;
    }
  }

  if (role === "admin") {
    return [...commonItems, getBookManage(role), borrowManage, getUserManage(role), ... libraryInfoManage];
  }

  if (role === "manager") {
    return [...commonItems, getBookManage(role), borrowManage, getUserManage(role)];
  }

  return commonItems; // fallback
};

export default function SideNav() {
  const { Sider } = Layout;
  const navigate = useNavigate();
  const [libInfo, setLibInfo] = useState(null);
  const [role, setRole] = useState("");
  
  const fetchLibraryInfo = async () => {
    const response = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
    setLibInfo(response.data.abouts);
  };

  const fetchCurrentUser = async () => {
    const response = await userApi.getCurrentUser(); 
    const roleRes = await roleApi.getRoleById(response.data.role); // API trả về user có field `role`
    setRole(roleRes.data.name);
  };
  

  console.log(role);
  useEffect(() => {
    fetchCurrentUser();
    fetchLibraryInfo();
  }, []);

  const logo = libInfo?.find((item) => item.name === "Logo")?.detail;

  const handleMenuOnClick = ({ key }) => {
    navigate(key);
  };

  const items = getMenuItemsByRole(role);
  
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
