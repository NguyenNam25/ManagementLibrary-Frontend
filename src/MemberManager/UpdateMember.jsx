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
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import ImageDragger from "./ImageDragger";
import userApi from "../../api/user/index";
import roleApi from "../../api/role/index";

const { Content } = Layout;

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

export default function UpdateMember() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const { state } = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await userApi.getUserById(state?.id);

      const convertData = {
        ...response.data,
        dateOfBirth: dayjs(response.data.dateOfBirth),
      };

      setUser(convertData);
      form.setFieldsValue(convertData);
    };
    fetchUser();
  }, [state]);

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
    try {
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
      // Format the data according to the server's expectations
      
      const response = await userApi.updateUser(state?.id,formData);
      
      if (response.status === 201) {
        message.success("Cập nhật user thành công");
        form.resetFields();
        navigate("/manager-list");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Cập nhật User thất bại");
      }
      console.error("Error updating User:", error);
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
          <Card
            title="Tạo tài khoản quản lý"
            bordered={false}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              style={{
                height: "100%",
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <Row gutter={24} style={{ height: "100%" }}>
                <Col span={12} style={{ height: "100%" }}>
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

                       
                      </Col>
                    </Row>
                  </Space>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
                <Button type="primary" htmlType="submit" size="large">
                  Cập nhật tài khoản
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
