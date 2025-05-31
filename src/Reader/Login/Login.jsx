import React, { useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Divider,
  notification,
  Space,
  Alert
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoginOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import ReaderNav from "../Layout/ReaderNav";
import userApi from "../../../api/user";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setLoginError("");
      
      const response = await userApi.loginForUser({
        email: values.username,
        password: values.password
      });
      if (response.status === 200) {
        // Store user info and token in localStorage
        const userInfo = {
          name: response.data.name || response.data.username || values.username.split('@')[0],
          email: response.data.email || values.username,
          id: response.data.id || response.data._id
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('token', response.data.token);

        notification.success({
          message: "Login Successful",
          description: `Welcome back, ${userInfo.name}!`,
        });
        navigate("/reader/home");
      } else {
        setLoginError("Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setLoginError("User is not active. Please wait for the library to activate.");
        } else {
          setLoginError("Failed to login. Please try again later.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout">
      <ReaderNav />
      <Content style={{ padding: "50px 50px", backgroundColor: "#f5f5f5", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2}>Login to Your Account</Title>
            <Text type="secondary">
              Enter your credentials to access your library account
            </Text>
          </div>

          <Card bordered={false} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {loginError && (
              <Alert
                message={loginError}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 24 }}
              />
            )}
            
            <Form
              form={form}
              name="login"
              initialValues={{ remember: true }}
              onFinish={handleSubmit}
              layout="vertical"
            >
              <Form.Item
                name="username"
                label="Email/Username"
                rules={[
                  { required: true, message: "Please enter your email or username" },
                  { type: "email", message: "Please enter a valid email address" }
                ]}
              >
                <Input 
                  prefix={<UserOutlined className="site-form-item-icon" />} 
                  placeholder="Email or Username" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Link to="/reader/forgot-password">Forgot password?</Link>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  icon={<LoginOutlined />}
                  loading={loading}
                >
                  Log In
                </Button>
              </Form.Item>
              
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Text type="secondary">Don't have an account?</Text>{" "}
                <Link to="/reader/signup">Sign up</Link>
              </div>
            </Form>
          </Card>
          
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Space>
              <Link to="/reader/home">
                <HomeOutlined /> Back to Home
              </Link>
              <Divider type="vertical" />
              <Link to="/reader/service">
                Help & Support
              </Link>
            </Space>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
