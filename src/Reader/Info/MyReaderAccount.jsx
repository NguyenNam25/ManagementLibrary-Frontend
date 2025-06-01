import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Avatar,
  Form,
  Input,
  Button,
  Divider,
  Row,
  Col,
  Tabs,
  Alert,
  Space,
  Descriptions
} from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined
} from "@ant-design/icons";
import ReaderNav from "../Layout/ReaderNav";
import userApi from "../../../api/user";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function MyReaderAccount() {
  // State to track if editing is active
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await userApi.getCurrentUser();
      setCurrentUser(response.data);
    };
    fetchCurrentUser();
  }, []);

  console.log(currentUser);

  // Mock user data (in a real app this would come from an API)
  const [userData, setUserData] = useState({
    id: "R1023456",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Reading Lane, Booktown, BT 12345",
    memberSince: "January 15, 2022",
    cardNumber: "LIB-2022-0123456",
    cardStatus: "Active",
    cardExpiry: "January 15, 2025"
  });

  // Form for profile editing
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Initialize form with user data
  React.useEffect(() => {
    profileForm.setFieldsValue({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address
    });
  }, [userData, profileForm]);

  // Handle profile form submission
  const handleProfileSubmit = (values) => {
    setUserData({ ...userData, ...values });
    setEditingProfile(false);
    // In a real app, you would make an API call here
  };

  // Handle password change submission
  const handlePasswordSubmit = (values) => {
    // In a real app, you would make an API call here
    console.log("Password change requested", values);
    setChangingPassword(false);
    passwordForm.resetFields();
  };

  return (
    <Layout>
      <div>
        <ReaderNav />
      </div>
      <Content style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "calc(100vh - 64px)" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Tài khoản người đọc
        </Title>

        <Row gutter={[24, 24]}>
          {/* User Information Section */}
          <Col xs={24} lg={16}>
            <Card 
              title={
                <Space>
                  <UserOutlined />
                  <span>Thông tin cá nhân</span>
                </Space>
              }
              extra={
                !editingProfile ? (
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={() => setEditingProfile(true)}
                  >
                    Chỉnh sửa
                  </Button>
                ) : null
              }
              bordered={false}
            >
              {!editingProfile ? (
                <Descriptions layout="vertical" column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="Họ và tên">
                    <Space>
                      <UserOutlined />
                      {currentUser?.fullName}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined />
                      {currentUser?.email}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Space>
                      <PhoneOutlined />
                      {currentUser?.phoneNumber}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    <Space>
                      <HomeOutlined />
                      {currentUser?.address}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh" span={2}>
                    {new Date(currentUser?.dateOfBirth).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileSubmit}
                >
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Vui lòng nhập email hợp lệ" }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                  >
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                  >
                    <Input.TextArea prefix={<HomeOutlined />} autoSize={{ minRows: 2, maxRows: 4 }} />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                        Lưu thay đổi
                      </Button>
                      <Button 
                        icon={<CloseOutlined />} 
                        onClick={() => setEditingProfile(false)}
                      >
                        Hủy
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              )}
            </Card>

            <Card 
              title={
                <Space>
                  <LockOutlined />
                  <span>Đổi mật khẩu</span>
                </Space>
              }
              style={{ marginTop: 24 }}
              bordered={false}
            >
              {!changingPassword ? (
                <div>
                  <Paragraph>
                    Vì lý do bảo mật, chúng tôi khuyến nghị thay đổi mật khẩu thường xuyên.
                  </Paragraph>
                  <Button 
                    type="primary" 
                    onClick={() => setChangingPassword(true)}
                  >
                    Đổi mật khẩu
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
                    label="Mật khẩu hiện tại"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu mới" },
                      { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" }
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Hai mật khẩu không khớp'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Cập nhật mật khẩu
                      </Button>
                      <Button onClick={() => setChangingPassword(false)}>
                        Hủy
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </Col>

          {/* Library Card Section */}
          <Col xs={24} lg={8}>
            <Card 
              title={
                <Space>
                  <IdcardOutlined />
                  <span>Thẻ thư viện</span>
                </Space>
              }
              bordered={false}
            >
              <div 
                style={{ 
                  background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                  color: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "16px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}
              >
                <Row align="middle" gutter={[16, 16]}>
                  <Col span={6}>
                    <Avatar size={64} icon={<UserOutlined />} />
                  </Col>
                  <Col span={18}>
                    <Title level={4} style={{ color: "white", margin: 0 }}>
                      {currentUser?.fullName}
                    </Title>
                    <Text style={{ color: "white" }}>
                      {currentUser?._id}
                    </Text>
                  </Col>
                </Row>
                <Divider style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <Text style={{ color: "white", display: "block" }}>
                      Số thẻ:
                    </Text>
                    <Title level={5} style={{ color: "white", margin: "4px 0" }}>
                      {currentUser?.libraryCard?.cardNumber}
                    </Title>
                  </Col>
                  <Col span={12}>
                    <Text style={{ color: "white", display: "block" }}>
                      Trạng thái:
                    </Text>
                    <Text strong style={{ color: "white" }}>
                      {currentUser?.status}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ color: "white", display: "block" }}>
                      Hết hạn:
                    </Text>
                    <Text strong style={{ color: "white" }}>
                      {userData.cardExpiry}
                    </Text>
                  </Col>
                </Row>
              </div>

              <Alert
                message="Sử dụng thẻ"
                description="Xuất trình thẻ thư viện khi mượn sách. Bạn cũng có thể sử dụng thẻ kỹ thuật số hiển thị ở trên."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Alert
                message="Mất hoặc hư hỏng thẻ?"
                description="Nếu thẻ của bạn bị mất hoặc hư hỏng, vui lòng đến thư viện để được cấp thẻ mới."
                type="warning"
                showIcon
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
