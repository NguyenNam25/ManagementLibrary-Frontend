import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Flex, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/user/index.js";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;
      const response = await userApi.loginForUser({ email, password });
      
      if (response.status === 200) {
        message.success(response.data);
        message.success('Login successful!');
        navigate("/home");
      } else {
        message.error(response.data?.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[url('./images/Login/login-bg.jpg')] bg-cover bg-center">
      <div className="border-none w-[29.375rem] py-15 px-[4.375rem] h-auto t-10 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.3)] bg-white">
        <div className="mb-8">
          <h1 className="text-4xl text-center">Quản lý thư viện</h1>
        </div>
        <Form 
          onFinish={onFinish} 
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item 
            label="Email" 
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
              suffix={<MailOutlined />}
            />
          </Form.Item>
          <Form.Item 
            label="Mật khẩu" 
            name="password" 
            className="font-semibold"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              placeholder="Password" 
              className="h-12 font-normal" 
            />
          </Form.Item>
          <Form.Item className="w-full">
            <Flex justify="space-between">
              <Checkbox name="rememberMe">Remember me</Checkbox>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                }}
                className="block text-sm text-gray-500 hover:text-gray-700"
              >
                Quên mật khẩu?
              </a>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large" 
              className="mt-7"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
      
    </div>
  );
}
