import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Avatar,
  Form,
  Input,
  Button,
  Row,
  Col,
  Badge,
  Alert,
  Space,
  Descriptions,
  Tag,
  Upload,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  BankOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import userApi from "../../api/user";
import roleApi from "../../api/role";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function MyAccount() {
  // State to track if editing is active
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Mock staff data (in a real app this would come from an API)
  const [staffData, setStaffData] = useState({});

  const fetchCurrentUser = async () => {
    try {
      const response = await userApi.getCurrentUser();
      const user = response.data;

      const roleResponse = await roleApi.getRoleById(user.role);
      const userWithDetails = {
        ...user,
        role: roleResponse.data,
        dateOfBirth: new Date(user.dateOfBirth).toLocaleDateString("en-GB"), // Chuyển đổi ngày sinh thành dạng YYYY-MM-DD
      };

      setStaffData(userWithDetails); // Đặt vào state dạng object
    } catch (error) {
      console.error("Error fetching current user:", error);
      message.error("Failed to fetch current user");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Form for profile editing
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Initialize form with user data
  React.useEffect(() => {
    profileForm.setFieldsValue({
      fullName: staffData?.fullName,
      gender: staffData?.gender,
      dateOfBirth: staffData?.dateOfBirth,
      email: staffData?.email,
      phoneNumber: staffData?.phoneNumber,
      address: staffData?.address,
    });
  }, [staffData, profileForm]);

  // Handle profile form submission
  const handleProfileSubmit = async (values) => {
    await userApi.updateUser(staffData?._id, values);
    setStaffData({ ...staffData, ...values });
    setEditingProfile(false);
    // In a real app, you would make an API call here
  };

  // Handle password change submission
  const handlePasswordSubmit = async (values) => {
    // In a real app, you would make an API call here
    await userApi.updateUser(staffData?.id, values);

    setChangingPassword(false);
    passwordForm.resetFields();
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
          <div style={{ marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0 }}>
              Staff Account Management
            </Title>
            <Text type="secondary">
              Manage your personal information and security settings
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {/* Staff Information Section */}
            <Col xs={24} lg={16}>
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <span>Staff Information</span>
                  </Space>
                }
                extra={
                  !editingProfile ? (
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => setEditingProfile(true)}
                    >
                      Edit
                    </Button>
                  ) : null
                }
                bordered={false}
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      size={100}
                      src={staffData?.image}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                    {editingProfile && (
                      <Upload
                        name="image"
                        action={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users/${staffData?._id}`}
                        method="put"
                        headers={{
                          Authorization: `Bearer ${localStorage.getItem('token')}`,
                        }}
                        multiple={false}
                        maxCount={1}
                        accept=".jpg,.png,.jpeg"
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith('image/');
                          if (!isImage) {
                            message.error('You can only upload image files!');
                            return Upload.LIST_IGNORE;
                          }
                          const isLt5M = file.size / 1024 / 1024 < 5;
                          if (!isLt5M) {
                            message.error('File must be smaller than 5MB!');
                            return Upload.LIST_IGNORE;
                          }
                          return true;
                        }}
                        onChange={(info) => {
                          const { status, response } = info.file;
                          if (status === 'uploading') {
                            message.loading('Uploading profile picture...');
                          } else if (status === 'done') {
                            message.success('Profile picture updated successfully');
                            fetchCurrentUser(); // Refresh user data
                          } else if (status === 'error') {
                            message.error(response?.message || 'Failed to update profile picture');
                          }
                        }}
                        showUploadList={false}
                      >
                        <Button 
                          type="text" 
                          icon={<EditOutlined />} 
                          style={{ 
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            padding: 0,
                            height: '32px',
                            width: '32px',
                            minWidth: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}
                        />
                      </Upload>
                    )}
                  </div>
                </div>
                {!editingProfile ? (
                  <Descriptions layout="vertical" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Name">
                      <Space>
                        <UserOutlined />
                        {staffData?.fullName}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Gender">
                      <Space>
                        <MailOutlined />
                        {staffData?.gender}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Date of Birth">
                      <Space>
                        <CalendarOutlined />
                        {staffData?.dateOfBirth}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <Space>
                        <MailOutlined />
                        {staffData?.email}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      <Space>
                        <PhoneOutlined />
                        {staffData?.phoneNumber}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                      <Space>
                        <EnvironmentOutlined />
                        {staffData?.address}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Position">
                      <Space>
                        <IdcardOutlined />
                        {staffData?.role?.name}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Staff ID">
                      <Badge status="success" text={staffData?.staffId} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Position">
                      <Space>
                        <IdcardOutlined />
                        {new Date(staffData?.createdAt).toLocaleDateString("en-GB")}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleProfileSubmit}
                  >
                    <Form.Item
                      name="fullName"
                      label="Name"
                      rules={[
                        { required: true, message: "Please enter your name" },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="gender"
                      label="Gender"
                      rules={[
                        { required: true, message: "Please enter your gender" },
                        {
                          type: "gender",
                          message: "Please enter a valid gender",
                        },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="dateOfBirth"
                      label="Date of Birth"
                      rules={[
                        { required: true, message: "Please enter your date of birth" },
                      ]}
                    >
                      <Input prefix={<CalendarOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="phoneNumber"
                      label="Phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your phone number",
                        },
                      ]}
                    >
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="address"
                      label="Address"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your address",
                        },
                      ]}
                    >
                      <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
                    </Form.Item>
                    <Form.Item>
                      <Space>
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          htmlType="submit"
                        >
                          Save Changes
                        </Button>
                        <Button
                          icon={<CloseOutlined />}
                          onClick={() => setEditingProfile(false)}
                        >
                          Cancel
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                )}
              </Card>

              <Card
                title={
                  <Space>
                    <TeamOutlined />
                    <span>System Access & Permissions</span>
                  </Space>
                }
                style={{
                  marginTop: 24,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
                bordered={false}
              >
                <Paragraph>
                  You currently have the following system permissions:
                </Paragraph>
                <div style={{ marginBottom: 16 }}>
                  {staffData?.role?.permissions.map((perm) => (
                    <Tag color="blue" key={perm} style={{ margin: "4px" }}>
                      {perm}
                    </Tag>
                  ))}
                </div>
                {staffData?.role?.name !== "admin" && (
                  <Alert
                    message="Permission Changes"
                    description="To request changes to your system permissions, please contact the system administrator."
                    type="info"
                    showIcon
                  />
                )}
              </Card>

              <Card
                title={
                  <Space>
                    <LockOutlined />
                    <span>Change Password</span>
                  </Space>
                }
                style={{
                  marginTop: 24,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
                bordered={false}
              >
                {!changingPassword ? (
                  <div>
                    <Paragraph>
                      For security reasons, we recommend changing your password
                      regularly. Staff passwords must be changed every 90 days.
                    </Paragraph>
                    <Button
                      type="primary"
                      onClick={() => setChangingPassword(true)}
                    >
                      Change Password
                    </Button>
                  </div>
                ) : (
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordSubmit}
                  >
                    <Form.Item
                      name="currentPassword"
                      label="Current Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your current password",
                        },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter a new password",
                        },
                        {
                          min: 10,
                          message:
                            "Staff passwords must be at least 10 characters",
                        },
                        {
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
                          message:
                            "Password must contain uppercase, lowercase, number and special character",
                        },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="confirmPassword"
                      label="Confirm New Password"
                      dependencies={["newPassword"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your new password",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("The two passwords do not match")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item>
                      <Space>
                        <Button type="primary" htmlType="submit">
                          Update Password
                        </Button>
                        <Button onClick={() => setChangingPassword(false)}>
                          Cancel
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                )}
              </Card>
            </Col>

            {/* Staff Profile Section */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <IdcardOutlined />
                    <span>Staff Profile</span>
                  </Space>
                }
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
                bordered={false}
              >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <Avatar
                    size={100}
                    src={staffData?.image}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                    {staffData?.fullName}
                  </Title>
                  <Text type="secondary">{staffData?.role?.name}</Text>
                  <br />
                  <Badge
                    status="success"
                    text="Active"
                    style={{ marginTop: 8 }}
                  />
                </div>

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col span={24}>
                    <Card size="small" title="Staff ID" bordered>
                      <Text strong>{staffData?.staffId}</Text>
                    </Card>
                  </Col>
                </Row>

                <Alert
                  message="Security Notice"
                  description="Remember to keep your credentials secure and never share your password with anyone. Lock your workstation when not in use."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Alert
                  message="Need Help?"
                  description="For account-related issues, contact IT support at support@librarysystem.com or ext. 4567."
                  type="info"
                  showIcon
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
