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
  Select,
  DatePicker,
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
import dayjs from "dayjs";

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
        dateOfBirth: dayjs(user.dateOfBirth), // Convert to dayjs object
      };

      setStaffData(userWithDetails);
    } catch (error) {
      console.error("Error fetching current user:", error);
      message.error("Không thể tải thông tin người dùng");
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
    if (staffData) {
      profileForm.setFieldsValue({
        fullName: staffData.fullName,
        gender: staffData.gender,
        dateOfBirth: staffData.dateOfBirth,
        email: staffData.email,
        phoneNumber: staffData.phoneNumber,
        address: staffData.address,
      });
    }
  }, [staffData, profileForm]);

  // Handle profile form submission
  const handleProfileSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
      };
      await userApi.updateUser(staffData?._id, formattedValues);
      setStaffData({ ...staffData, ...values });
      setEditingProfile(false);
      message.success("Cập nhật thông tin thành công");
    } catch (error) {
      message.error("Không thể cập nhật thông tin");
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (values) => {
    try {
      await userApi.updateUser(staffData?._id, values);
      setChangingPassword(false);
      passwordForm.resetFields();
      message.success("Cập nhật mật khẩu thành công");
    } catch (error) {
      message.error("Không thể cập nhật mật khẩu");
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
          <div style={{ marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý tài khoản
            </Title>
            <Text type="secondary">
              Quản lý thông tin cá nhân và cài đặt bảo mật
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {/* Staff Information Section */}
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
                            message.error('Chỉ có thể tải lên file hình ảnh!');
                            return Upload.LIST_IGNORE;
                          }
                          const isLt5M = file.size / 1024 / 1024 < 5;
                          if (!isLt5M) {
                            message.error('File phải nhỏ hơn 5MB!');
                            return Upload.LIST_IGNORE;
                          }
                          return true;
                        }}
                        onChange={(info) => {
                          const { status, response } = info.file;
                          if (status === 'uploading') {
                            message.loading('Đang tải lên ảnh đại diện...');
                          } else if (status === 'done') {
                            message.success('Cập nhật ảnh đại diện thành công');
                            fetchCurrentUser();
                          } else if (status === 'error') {
                            message.error(response?.message || 'Không thể cập nhật ảnh đại diện');
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
                    <Descriptions.Item label="Họ và tên">
                      <Space>
                        <UserOutlined />
                        {staffData?.fullName}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Giới tính">
                      <Space>
                        <MailOutlined />
                        {staffData?.gender}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">
                      <Space>
                        <CalendarOutlined />
                        {new Date(staffData?.dateOfBirth).toLocaleDateString('en-GB')}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <Space>
                        <MailOutlined />
                        {staffData?.email}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                      <Space>
                        <PhoneOutlined />
                        {staffData?.phoneNumber}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                      <Space>
                        <EnvironmentOutlined />
                        {staffData?.address}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Vai trò">
                      <Space>
                        <IdcardOutlined />
                        {staffData?.role?.name}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã nhân viên">
                      <Badge status="success" text={staffData?.staffId} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
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
                      label="Họ và tên"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ và tên" },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="gender"
                      label="Giới tính"
                      rules={[
                        { required: true, message: "Vui lòng chọn giới tính" },
                      ]}
                    >
                      <Select placeholder="Chọn giới tính">
                        <Select.Option value="male">Nam</Select.Option>
                        <Select.Option value="female">Nữ</Select.Option>
                        <Select.Option value="other">Khác</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="dateOfBirth"
                      label="Ngày sinh"
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày sinh" },
                      ]}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        {
                          type: "email",
                          message: "Email không hợp lệ",
                        },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="phoneNumber"
                      label="Số điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                      ]}
                    >
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="address"
                      label="Địa chỉ"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ",
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
                    <TeamOutlined />
                    <span>Quyền truy cập hệ thống</span>
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
                  Bạn hiện có các quyền hệ thống sau:
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
                    message="Thay đổi quyền"
                    description="Để yêu cầu thay đổi quyền hệ thống, vui lòng liên hệ với quản trị viên."
                    type="info"
                    showIcon
                  />
                )}
              </Card>

              <Card
                title={
                  <Space>
                    <LockOutlined />
                    <span>Đổi mật khẩu</span>
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
                      Vì lý do bảo mật, chúng tôi khuyến nghị thay đổi mật khẩu thường xuyên. Mật khẩu nhân viên phải được thay đổi sau mỗi 90 ngày.
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
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu hiện tại",
                        },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="newPassword"
                      label="Mật khẩu mới"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu mới",
                        },
                        {
                          min: 10,
                          message: "Mật khẩu phải có ít nhất 10 ký tự",
                        },
                        {
                          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
                          message: "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt",
                        },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="confirmPassword"
                      label="Xác nhận mật khẩu mới"
                      dependencies={["newPassword"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng xác nhận mật khẩu mới",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("newPassword") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error("Mật khẩu không khớp"));
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

            {/* Staff Profile Section */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <IdcardOutlined />
                    <span>Hồ sơ nhân viên</span>
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
                    text="Hoạt động"
                    style={{ marginTop: 8 }}
                  />
                </div>

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col span={24}>
                    <Card size="small" title="Mã nhân viên" bordered>
                      <Text strong>{staffData?.staffId}</Text>
                    </Card>
                  </Col>
                </Row>

                <Alert
                  message="Thông báo bảo mật"
                  description="Hãy nhớ giữ thông tin đăng nhập an toàn và không chia sẻ mật khẩu với bất kỳ ai. Khóa máy tính khi không sử dụng."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Alert
                  message="Cần hỗ trợ?"
                  description="Đối với các vấn đề liên quan đến tài khoản, liên hệ bộ phận IT tại support@librarysystem.com hoặc số máy nhánh 4567."
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
