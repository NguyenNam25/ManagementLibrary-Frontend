import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Layout,
  Button,
  Table,
  Modal,
  message,
  Tag,
  Space,
  Input,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import UserDetailPopUp from "./UserDetailPopUp";
import userApi from "../../api/user";
import roleApi from "../../api/role";

const { Content } = Layout;
const { Title, Text } = Typography;

const generateLibraryCardNumber = (length = 12) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const number = "0123456789";
  let password = "";
  for (let i = 0; i < length - 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < 8; i++) {
    password += number.charAt(Math.floor(Math.random() * number.length));
  }
  return password;
};

export default function WaitingMember() {
  const navigate = useNavigate();
  const [waitingUsers, setWaitingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Define the columns for waiting members
  const waitingMemberColumns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <span>
          <MailOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => (
        <span>
          <PhoneOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color="orange">Chờ duyệt</Tag>,
    },
    {
      title: "Chi tiết",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const fecthPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUserByStatus("unverified");
      const userWithDetails = await Promise.all(
        response.data.map(async (user) => {
          let roleData;
          const roleResponse = await roleApi.getRoleById(user.role);
          roleData = roleResponse.data;
          try {
            return {
              ...user,
              key: user._id,
              role: roleData.name,
              detail: getDetailButton({
                ...user,
                role: roleData.name,
              }),
              actions: getActionButtons(user._id),
            };
          } catch (error) {
            console.error(
              `Error fetching details for user ${user._id}:`,
              error
            );
            return {
              ...user,
              key: user._id,
              role: "Not Assigned",
              detail: getDetailButton(user),
              actions: getActionButtons(user._id),
            };
          }
        })
      );
      setWaitingUsers(userWithDetails);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredUsers = waitingUsers.filter((user) => {
    const searchLower = searchText.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.toLowerCase().includes(searchLower)
    );
  });

  // Generate mock data if no data is available
  useEffect(() => {
    fecthPendingUsers();
  }, []);

  const getDetailButton = (user) => (
    <Button
      type="primary"
      icon={<EyeOutlined />}
      onClick={() => {
        setSelectedUser(user);
        setIsModalVisible(true);
      }}
    />
  );

  const getActionButtons = (id) => (
    <Space>
      <Button
        type="primary"
        icon={<CheckCircleOutlined />}
        onClick={() => handleApprove(id)}
        style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
      >
        Duyệt
      </Button>
      <Button
        danger
        icon={<CloseCircleOutlined />}
        onClick={() => handleReject(id)}
      >
        Từ chối
      </Button>
    </Space>
  );

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    form.setFieldsValue({ password: newPassword });
  };

  const handleApprove = async (id) => {
    try {
      const newLibraryCardNumber = generateLibraryCardNumber();
      const response = await userApi.updateUser(id, { status: "active" });
      const responseLibraryCard = await userApi.createLibraryCardForUser(id, {
        cardNumber: newLibraryCardNumber,
        registrationDate: new Date(),
        expirationDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
      });

      console.log(response);
      console.log(responseLibraryCard);
      message.success("Đã duyệt yêu cầu đăng ký thành viên");
      fecthPendingUsers();
    } catch (error) {
      message.error("Không thể duyệt yêu cầu đăng ký thành viên");
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      Modal.confirm({
        title: "Reject Member Registration",
        content: "Are you sure you want to reject this membership request?",
        okText: "Reject",
        okType: "danger",
        onOk: async () => {
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await userApi.deleteUser(id);
            // Update the local state to remove the rejected user
            setWaitingUsers((prevUsers) =>
              prevUsers.filter((user) => user._id !== id)
            );

            message.success("Đã từ chối yêu cầu đăng ký thành viên");
          } catch (error) {
            message.error("Không thể từ chối yêu cầu đăng ký thành viên");
            console.error("Error rejecting membership request:", error);
          }
        },
      });
    } catch (error) {
      message.error("Không thể từ chối yêu cầu đăng ký thành viên");
      console.error("Error rejecting user:", error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <SideNav />
      <Layout style={{ background: "#f0f4f7", width: "100%" }}>
        <HeaderComponent title="Quản lý người dùng" />
        <Content
          style={{
            margin: 0,
            padding: "24px",
            width: "100%",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0 }}>
              Danh sách yêu cầu đăng ký
            </Title>
            <Text type="secondary">Danh sách yêu cầu đăng ký thành viên</Text>
          </div>

          <Table
            columns={waitingMemberColumns}
            dataSource={filteredUsers}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 6,
              showTotal: (total) => `Total ${total} pending members`,
            }}
            title={() => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "500" }}>
                  Danh sách yêu cầu đăng ký
                </span>
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: 300 }}
                  allowClear
                />
              </div>
            )}
          />

          <UserDetailPopUp
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            selectedUser={selectedUser}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
