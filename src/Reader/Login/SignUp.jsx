import React, { useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  Card,
  Divider,
  notification,
  Space,
  Checkbox,
  Select,
  Radio,
  Alert,
  DatePicker,
  Upload,
  Avatar,
  Steps
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  LockOutlined,
  UploadOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import ReaderNav from "../Layout/ReaderNav";
import dayjs from 'dayjs';
import userApi from "../../../api/user";
import axios from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function SignUp() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Values, setStep1Values] = useState(null);
  const navigate = useNavigate();

  const handleAvatarChange = (info) => {
    if (info.file) {
      console.log("file: ",info.file);
      setAvatarFile(info.file);
      // Create a preview URL for the image
    }
  };

  const uploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        notification.error({
          message: 'You can only upload image files!',
        });
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        notification.error({
          message: 'Image must be smaller than 2MB!',
        });
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: handleAvatarChange,
  };

  const steps = [
    {
      title: 'Account Information',
      content: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Please provide your email and password to create your account
          </Text>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              // { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              // { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
              { 
                // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
              }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              // { required: true, message: "Please confirm your password" },
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
              prefix={<LockOutlined />}
              placeholder="Confirm your password"
              size="large"
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Personal Information',
      content: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Please provide your personal details to complete the registration
          </Text>

          <Form.Item
            name="image"
            label="Profile Picture"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <div style={{ 
              textAlign: 'center', 
              marginBottom: 24,
              padding: '24px',
              border: '1px dashed #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              transition: 'all 0.3s'
            }}>
              <div style={{ 
                position: 'relative',
                display: 'inline-block',
                marginBottom: 16
              }}>
                <Avatar
                  size={120}
                  src={avatarUrl}
                  icon={<UserOutlined />}
                  style={{ 
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                />
                {avatarUrl && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: -30,
                      padding: 4
                    }}
                    onClick={() => {
                      setAvatarUrl(null);
                      setAvatarFile(null);
                      form.setFieldValue('avatar', []);
                    }}
                  />
                )}
              </div>
              <div>
                <Upload {...uploadProps}>
                  <Button 
                    type="primary" 
                    icon={<UploadOutlined />}
                    style={{ marginRight: 8 }}
                  >
                    Choose Image
                  </Button>
                </Upload>
                <div style={{ 
                  marginTop: 8,
                  color: '#8c8c8c',
                  fontSize: '12px'
                }}>
                  JPG, PNG or GIF (max. 2MB)
                </div>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter your full name" }
            ]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="Full Name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="citizenId"
            label="Citizen ID"
            rules={[
              { required: true, message: "Please enter your citizen ID" },
              { pattern: /^[0-9]{9,12}$/, message: "Please enter a valid citizen ID" }
            ]}
          >
            <Input 
              prefix={<IdcardOutlined />}
              placeholder="Citizen ID"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[
              { required: true, message: "Please select your date of birth" }
            ]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              size="large"
              placeholder="Select date of birth"
              disabledDate={(current) => {
                return current && current > dayjs().endOf('day');
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              { required: true, message: "Please select your gender" }
            ]}
          >
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
              { pattern: /^[0-9\-\+\s\(\)]{8,15}$/, message: "Please enter a valid phone number" }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />}
              placeholder="Phone Number"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[
              { required: true, message: "Please enter your address" }
            ]}
          >
            <Input.TextArea 
              placeholder="Address"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="occupation"
            label="Occupation"
            rules={[
              { required: true, message: "Please select a reader type" }
            ]}
          >
            <Select placeholder="Select Reader Type" size="large">
              <Option value="student">Student</Option>
              <Option value="teacher">Teacher/Professor</Option>
              <Option value="researcher">Researcher</Option>
              <Option value="general">General Public</Option>
            </Select>
          </Form.Item>

          <Form.Item name="newsSubscription" valuePropName="checked">
            <Checkbox>Subscribe to library newsletter and updates</Checkbox>
          </Form.Item>
          
          <Form.Item 
            name="termsAgreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms and conditions')) }
            ]}
          >
            <Checkbox>
              I agree to the <Link to="/reader/service">Terms and Conditions</Link> and <Link to="/reader/service">Privacy Policy</Link>
            </Checkbox>
          </Form.Item>

          <Alert
            message="Note"
            description="Upon approval, you will receive a library card that can be used to borrow books and access all library services."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        </div>
      ),
    },
  ];

  const next = async () => {
    try {
      const values = await form.validateFields();
      if (currentStep === 0) {
        // Store step 1 values
        setStep1Values(values);
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Create FormData object
      const formData = new FormData();
      
      // Combine step 1 values with current values
      const combinedValues = {
        ...step1Values,
        ...values
      };
      
      // Add all form fields to FormData
      formData.append('email', combinedValues.email);
      formData.append('password', combinedValues.password);
      formData.append('fullName', combinedValues.fullName.trim());
      formData.append('phoneNumber', combinedValues.phoneNumber.trim());
      formData.append('citizenId', combinedValues.citizenId.trim());
      formData.append('dateOfBirth', combinedValues.dateOfBirth.format('YYYY-MM-DD'));
      formData.append('gender', combinedValues.gender);
      formData.append('occupation', combinedValues.occupation);
      formData.append('address', combinedValues.address);
      formData.append('role', "680a42c489f73ba902c99b63");
      
      // Add avatar file if exists
      if (avatarFile) {
        formData.append('image', avatarFile);
      }
      
      // Add any additional fields from values
      Object.keys(combinedValues).forEach(key => {
        if (!formData.has(key)) {
          formData.append(key, combinedValues[key]);
        }
      });
      
      console.log("formData: ",formData.get('image'));
      // const response = await userApi.createUser(formData);
      const response = await axios.post("http://localhost:3000/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        notification.success({
          message: "Registration Successful",
          description: "Your account has been created successfully! You can now log in.",
        });
        form.resetFields();
        setStep1Values(null);
        setAvatarFile(null);
        setAvatarUrl(null);
        navigate("/reader/login");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        notification.error({
          message: "Registration Failed",
          description: error.response.data.message,
        });
      } else {
        notification.error({
          message: "Registration Failed",
          description: "Failed to create account. Please try again later.",
        });
      }
      console.error("Error creating account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout">
      <ReaderNav />
      <Content style={{ padding: "40px", backgroundColor: "#f5f5f5", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2}>Sign Up</Title>
            <Text type="secondary">
              Create a new account to access the library system
            </Text>
          </div>

          <Card bordered={false} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <Steps current={currentStep} style={{ marginBottom: 32 }}>
              {steps.map(item => (
                <Steps.Step key={item.title} title={item.title} />
              ))}
            </Steps>

            <Form
              form={form}
              layout="vertical"
              name="register"
              onFinish={handleSubmit}
            >
              {steps[currentStep].content}

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                {currentStep > 0 && (
                  <Button onClick={prev}>
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button type="primary" onClick={next}>
                    Next
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    loading={loading}
                    icon={<CheckCircleOutlined />}
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </Form>
          </Card>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Space>
              <Text type="secondary">Already have an account?</Text>
              <Link to="/reader/login">Log in</Link>
              <Divider type="vertical" />
              <Link to="/reader/home">
                <HomeOutlined /> Back to Home
              </Link>
            </Space>
          </div>
        </div>
      </Content>
    </Layout>
  );
} 