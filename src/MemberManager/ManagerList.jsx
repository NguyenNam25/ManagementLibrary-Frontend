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
  EditOutlined,
  DeleteOutlined,
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

export default function ManagerList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Define columns for the member list table
  const memberColumns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
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
          {text || "Not provided"}
        </span>
      ),
    },

    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = "blue";
        if (role === "Admin") {
          color = "red";
        } else if (role === "Librarian") {
          color = "green";
        } else if (role === "Reader") {
          color = "purple";
        }
        return <Tag color={color}>{role?.toUpperCase() === 'MANAGER' ? "Quản Lý" : "Admin"}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "blocked") {
          color = "red";
        } else if (status === "unverified") {
          color = "orange";
        }
        return <Tag color={color}>{status?.toUpperCase() === "ACTIVE"?"Hoạt động":"Không hoạt động"}</Tag>;
      },
    },
    {
      title: "Chi tiết",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "Hành động",
      dataIndex: "UD",
      key: "actions",
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers();

      // Filter for non-pending users (approved members only)
      const activeUsers = response.data.filter(
        (user) => user.status !== "unverified"
      );

      const userWithDetails = await Promise.all(
        activeUsers.map(async (user) => {
          let roleData;
          const roleResponse = await roleApi.getRoleById(user.role);
          roleData = roleResponse.data;
          if (roleData.name !== "reader") {
            try {
              return {
                ...user,
                key: user._id,
                role: roleData.name,
                detail: getDetailButton({
                  ...user,
                  role: roleData.name,
                }),
                UD: getActionButtons(user._id),
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
                UD: getActionButtons(user._id),
              };
            }
          }
        })
      );
      // Filter out undefined values (non-reader users)
      setUsers(userWithDetails.filter(Boolean));
    } catch (error) {
      message.error("Failed to fetch Users");
      console.error("Error fetching Users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchText.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    fetchUsers();
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
        icon={<EditOutlined />}
        onClick={() => handleUpdate(id)}
      >
        Sửa
      </Button>
      <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(id)}>
        Xóa
      </Button>
    </Space>
  );

  const handleUpdate = async (id) => {
    try {
      navigate(`/manager/${id}/update`, {
        state: { id },
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      Modal.confirm({
        title: "Xóa người dùng",
        content:
          "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.",
        okText: "Xóa",
        okType: "danger",
        onOk: async () => {
          try {
            await userApi.deleteUser(id);
            message.success("Đã xóa người dùng thành công");
            fetchUsers();
          } catch (error) {
            message.error("Không thể xóa người dùng");
            console.error("Error deleting user:", error);
          }
        },
      });
    } catch (error) {
      message.error("Không thể xóa người dùng");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <SideNav />
      <Layout style={{ background: "#f0f4f7", width: "100%" }}>
        <HeaderComponent title="Quản lý người dùng"/>
        <Content
          style={{
            margin: 0,
            padding: "24px",
            width: "100%",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0 }}>
              Danh sách nhân viên
            </Title>
            <Text type="secondary">Danh sách nhân viên</Text>
          </div>

          <Table
            columns={memberColumns}
            dataSource={filteredUsers}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} members`,
            }}
            title={() => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

                  <Input
                    placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                  />
                </div>
                <Button
                  type="primary"
                  onClick={() => navigate("/manager/account-create")}
                  icon={<UserOutlined />}
                >
                  Tạo tài khoản quản lý
                </Button>
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
