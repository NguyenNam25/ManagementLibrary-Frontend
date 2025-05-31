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
      title: "Name",
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
      title: "Phone",
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
      title: "Role",
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
        return <Tag color={color}>{role?.toUpperCase() || "UNASSIGNED"}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "blocked") {
          color = "red";
        } else if (status === "unverified") {
          color = "orange";
        }
        return <Tag color={color}>{status?.toUpperCase() || "ACTIVE"}</Tag>;
      },
    },
    {
      title: "Detail",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "Actions",
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
        Edit
      </Button>
      <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(id)}>
        Delete
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
        title: "Delete Member",
        content:
          "Are you sure you want to delete this member? This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        onOk: async () => {
          try {
            await userApi.deleteUser(id);
            message.success("User deleted successfully");
            fetchUsers();
          } catch (error) {
            message.error("Failed to delete user");
            console.error("Error deleting user:", error);
          }
        },
      });
    } catch (error) {
      message.error("Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

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
          <Breadcrumb style={{ marginBottom: "16px" }}>
            <Breadcrumb.Item>
              <Link to="/home">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Member Management</Breadcrumb.Item>
            <Breadcrumb.Item>Member List</Breadcrumb.Item>
          </Breadcrumb>

          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search by name, email, or phone..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
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
                <span style={{ fontSize: "18px", fontWeight: "500" }}>
                  Member List
                </span>
                <Button
                  type="primary"
                  onClick={() => navigate("/member/account-create")}
                  icon={<UserOutlined />}
                >
                  Create New Member
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
