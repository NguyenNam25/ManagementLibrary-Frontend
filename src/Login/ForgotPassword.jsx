import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function ForgotPassword() {
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[url('./images/Login/login-bg.jpg')] bg-cover bg-center">
      <div className="border-none w-[29.375rem] py-15 px-[4.375rem] h-auto t-10 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.3)] bg-white">
        <div className="mb-8 text-center">
          <Title level={2}>Forgot Password</Title>
          <Text type="secondary">Enter your email to reset your password</Text>
        </div>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item 
            name="email" 
            className="font-semibold"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              placeholder="Email"
              className="h-12 font-normal"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" className="mt-7">
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 text-center">
          <Text>
            Remember your password?{" "}
            <a 
              href="#" 
              className="text-blue-500 hover:text-blue-700 hover:underline"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </a>
          </Text>
        </div>
      </div>
    </div>
  );
} 