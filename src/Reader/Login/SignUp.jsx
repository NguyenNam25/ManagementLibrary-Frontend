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
          message: 'Bạn chỉ có thể tải lên file hình ảnh!',
        });
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        notification.error({
          message: 'Hình ảnh phải nhỏ hơn 2MB!',
        });
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: handleAvatarChange,
  };

  const steps = [
    {
      title: 'Thông tin tài khoản',
      content: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Vui lòng cung cấp email và mật khẩu để tạo tài khoản
          </Text>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: "email", message: "Vui lòng nhập địa chỉ email hợp lệ" }
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
            label="Mật khẩu"
            rules={[
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
              { 
                message: "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt"
              }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu của bạn"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu của bạn"
              size="large"
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Thông tin cá nhân',
      content: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Vui lòng cung cấp thông tin cá nhân để hoàn tất đăng ký
          </Text>

          <Form.Item
            name="image"
            label="Ảnh đại diện"
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
                    Chọn ảnh
                  </Button>
                </Upload>
                <div style={{ 
                  marginTop: 8,
                  color: '#8c8c8c',
                  fontSize: '12px'
                }}>
                  JPG, PNG hoặc GIF (tối đa 2MB)
                </div>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên" }
            ]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="citizenId"
            label="CMND/CCCD"
            rules={[
              { required: true, message: "Vui lòng nhập CMND/CCCD" },
              { pattern: /^[0-9]{9,12}$/, message: "Vui lòng nhập CMND/CCCD hợp lệ" }
            ]}
          >
            <Input 
              prefix={<IdcardOutlined />}
              placeholder="CMND/CCCD"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[
              { required: true, message: "Vui lòng chọn ngày sinh" }
            ]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              size="large"
              placeholder="Chọn ngày sinh"
              disabledDate={(current) => {
                return current && current > dayjs().endOf('day');
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[
              { required: true, message: "Vui lòng chọn giới tính" }
            ]}
          >
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
              <Radio value="other">Khác</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              { pattern: /^[0-9\-\+\s\(\)]{8,15}$/, message: "Vui lòng nhập số điện thoại hợp lệ" }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ" }
            ]}
          >
            <Input.TextArea 
              placeholder="Địa chỉ"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="occupation"
            label="Nghề nghiệp"
            rules={[
              { required: true, message: "Vui lòng chọn loại độc giả" }
            ]}
          >
            <Select placeholder="Chọn loại độc giả" size="large">
              <Option value="student">Sinh viên</Option>
              <Option value="teacher">Giáo viên/Giảng viên</Option>
              <Option value="researcher">Nhà nghiên cứu</Option>
              <Option value="general">Công chúng</Option>
            </Select>
          </Form.Item>

          <Form.Item name="newsSubscription" valuePropName="checked">
            <Checkbox>Đăng ký nhận bản tin và cập nhật từ thư viện</Checkbox>
          </Form.Item>
          
          <Form.Item 
            name="termsAgreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản và điều kiện')) }
            ]}
          >
            <Checkbox>
              Tôi đồng ý với <Link to="/reader/service">Điều khoản và Điều kiện</Link> và <Link to="/reader/service">Chính sách Bảo mật</Link>
            </Checkbox>
          </Form.Item>

          <Alert
            message="Lưu ý"
            description="Sau khi được phê duyệt, bạn sẽ nhận được thẻ thư viện có thể sử dụng để mượn sách và truy cập tất cả dịch vụ thư viện."
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
          message: "Đăng ký thành công",
          description: "Tài khoản của bạn đã được tạo thành công! Bạn có thể đăng nhập ngay bây giờ.",
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
          message: "Đăng ký thất bại",
          description: error.response.data.message,
        });
      } else {
        notification.error({
          message: "Đăng ký thất bại",
          description: "Không thể tạo tài khoản. Vui lòng thử lại sau.",
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