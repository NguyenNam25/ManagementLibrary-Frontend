import React from "react";
import { Form, Input, Button, Flex } from "antd";
import { MailOutlined, UserOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
  const navigate = useNavigate();
  const handleRegisterOnClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[url('./images/Login/login-bg.jpg')] bg-cover bg-center">
      <div className="border-none w-[29.375rem] py-15 px-[4.375rem] h-auto t-10 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.3)] bg-white">
        <div className="mb-8">
          <h1 className="text-4xl text-center">Create Account</h1>
        </div>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item 
            label="Full Name" 
            name="fullName" 
            className="font-semibold"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input
              placeholder="Full Name"
              className="h-12 font-normal"
              prefix={<UserOutlined />}
            />
          </Form.Item>

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
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item 
            label="Phone Number" 
            name="phone" 
            className="font-semibold"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input
              placeholder="Phone Number"
              className="h-12 font-normal"
              prefix={<PhoneOutlined />}
            />
          </Form.Item>

          <Form.Item 
            label="Password" 
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
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item 
            label="Confirm Password" 
            name="confirmPassword" 
            className="font-semibold"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Confirm Password" 
              className="h-12 font-normal"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" className="mt-7" onClick={handleRegisterOnClick}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="mt-6">
        <p className="text-white">Already have an account? <a href="#" className="hover:text-blue-400 hover:underline" onClick={() => navigate("/login")}>Login</a> here!</p>
      </div>
    </div>
  );
} 