import React, { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Button,
  Form,
  Select,
  Space,
  Row,
  Col,
  Card,
  DatePicker,
  message,
  Typography,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import ImageDragger from "./ImageDragger";
import userApi from "../../api/user/index";
import roleApi from "../../api/role/index";
import axios from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;


const generatePassword = (length = 8) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

function toCapitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function AccountCreate() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await roleApi.getAllRoles();
      setRoles(response.data);
    };
    fetchRoles();
  }, []);

  const selectRole = roles.map((role) => {
    if (role.name === "manager" || role.name === "Mod") {
      return (
        <Select.Option value={role._id} key={role._id}>
          {role.name}
        </Select.Option>
      );
    }
  });
  // console.log(roles);

  const onFinish = async (values) => {
    console.log(values);
    try {
      setUploading(true);
      // Create FormData object to handle file upload
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(values).forEach(key => {
        if (key === 'image' && values[key]) {
          formData.append('image', values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      // Always set status to active
      formData.append('status', 'active');

      const response = await userApi.createUser(formData);
      
      if (response.status === 201) {
        message.success("Thêm tài khoản thành công");
        form.resetFields();
        navigate("/manager-list");
      } else {
        message.error(response.data?.message || "Thêm tài khoản thất bại");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      message.error(error.response?.data?.message || "Thêm tài khoản thất bại. Vui lòng thử lại sau.");
    } finally {
      setUploading(false);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    form.setFieldsValue({ password: newPassword });
  };

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
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
              Tạo tài khoản quản lý
            </Title>
            <Text type="secondary">Tạo tài khoản quản lý</Text>
          </div>
          <Card
            title="Tạo tài khoản quản lý"
            bordered={false}
            style={{
              width: "100%",
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              style={{
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <Row gutter={24} style={{}}>
                <Col span={12} style={{}}>
                  <Form.Item
                    label="Ảnh đại diện"
                    name="image"
                    rules={[
                      {
                        required: false,
                        message: "Vui lòng tải lên ảnh đại diện",
                      },
                    ]}
                  >
                    <ImageDragger />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ height: "100%" }}>
                  <Space
                    direction="vertical"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Form.Item
                      label="Họ và tên"
                      name="fullName"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập họ và tên",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Nhập họ và tên"
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Vai trò"
                          name="role"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn vai trò",
                            },
                          ]}
                        >
                          <Select placeholder="Chọn vai trò">
                            {selectRole}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Giới tính"
                          name="gender"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn giới tính",
                            },
                          ]}
                        >
                          <Select placeholder="Chọn giới tính">
                            <Select.Option value="male">Nam</Select.Option>
                            <Select.Option value="female">Nữ</Select.Option>
                            <Select.Option value="other">Khác</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập email",
                        },
                        {
                          type: "email",
                          message: "Email không hợp lệ",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Số điện thoại"
                          name="phoneNumber"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số điện thoại",
                            },
                            {
                              pattern: /^[0-9]{10,15}$/,
                              message: "Số điện thoại không hợp lệ",
                            },
                          ]}
                        >
                          <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Số CMND/CCCD"
                          name="citizenId"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số CMND/CCCD",
                            },
                            {
                              pattern: /^[0-9]{9,12}$/,
                              message: "Số CMND/CCCD không hợp lệ",
                            },
                          ]}
                        >
                          <Input placeholder="Nhập số CMND/CCCD" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Địa chỉ"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Ngày sinh"
                          name="dateOfBirth"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ngày sinh",
                            },
                          ]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            placeholder="Chọn ngày sinh"
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          gap: "10px",
                        }}
                      >
                        <Form.Item
                          label="Mật khẩu"
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập mật khẩu",
                            },
                          ]}
                          style={{ flex: 1 }}
                        >
                          <Input.Password
                            visibilityToggle={{ visible: true }}
                            placeholder="Nhập mật khẩu"
                          />
                        </Form.Item>

                        <Button
                          onClick={handleGeneratePassword}
                          style={{ marginBottom: "24px" }}
                        >
                          Auto
                        </Button>
                      </Col>
                    </Row>
                  </Space>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
                <Button type="primary" htmlType="submit" size="large">
                  Tạo tài khoản
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
