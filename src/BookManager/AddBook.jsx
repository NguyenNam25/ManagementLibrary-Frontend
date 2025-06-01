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
  message,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import majorApi from "../../api/major/index.js";
import bookApi from "../../api/book/index.js";
import ImageDragger from "./ImageDragger";
import userApi from "../../api/user/index.js";
import axiosClient from "../../api/axiosClient.js";
import axios from "axios";
const { Title, Text } = Typography;
export default function AddBook() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [types, setType] = useState([]);
  const [categories, setCategory] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    try {
      const fetchMajors = async () => {
        const [typeRes, categoryRes] = await Promise.all([
          majorApi.getAllTypes(),
          majorApi.getAllCategories(),
        ]);
        setType(typeRes.data);
        setCategory(categoryRes.data);
      };
      fetchMajors();
    } catch (error) {
      console.error("Error fetching majors:", error);
    }
  }, []);

  const selectType = (types || []).map((type) => {
    return (
      <Select.Option value={type._id} key={type._id}>
        {type.name}
      </Select.Option>
    );
  });

  const selectCategory = (categories || []).map((category) => {
    return (
      <Select.Option value={category._id} key={category._id}>
        {category.name}
      </Select.Option>
    );
  });

  const onFinish = async (values) => {
    try {
      setUploading(true);
      // Create FormData object to handle file upload
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(values).forEach(key => {
        console.log(key, values[key]);
        if (key === 'image' && values[key]) {
          formData.append('image', values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await axios.post("http://localhost:3000/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (response.status === 201) {
        message.success("Thêm sách thành công");
        form.resetFields();
        navigate("/book-list");
      }
    } catch (error) {
      message.error("Thêm sách thất bại");
      console.error("Error creating book:", error);
    } finally {
      setUploading(false);
    }
  };

  const { Content } = Layout;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideNav />
      <Layout style={{ background: "#f0f4f7", flex: 1 }}>
        <HeaderComponent title="Quản lý sách" />
        <Content
          style={{
            margin: 0,
            padding: "24px",
            width: "100%",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0 }}>
              Thêm sách mới
            </Title>
            <Text type="secondary">Thêm sách mới vào thư viện</Text>
          </div>
          <Card
            title="Thêm sách mới"
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
                    label="Ảnh bìa sách"
                    name="image"
                    rules={[
                      {
                        required: false,
                        message: "Vui lòng tải lên ảnh bìa sách",
                      },
                    ]}
                    style={{}}
                  >
                    <ImageDragger />
                  </Form.Item>
                </Col>
                <Col span={12} style={{}}>
                  <Space
                    direction="vertical"
                    style={{ width: "100%"}}
                  >
                    <Row gutter={16}>
                      
                      
                    </Row>

                    <Form.Item
                      label="Tiêu đề"
                      name="name"
                      rules={[
                        { required: true, message: "Vui lòng nhập tiêu đề" },
                      ]}
                    >
                      <Input placeholder="Nhập tiêu đề sách" />
                    </Form.Item>

                    <Form.Item
                      label="Tác giả"
                      name="author"
                      rules={[
                        { required: true, message: "Vui lòng nhập tác giả" },
                      ]}
                    >
                      <Input placeholder="Nhập tên tác giả" />
                    </Form.Item>

                    <Form.Item
                      label="Nhà xuất bản"
                      name="publisherName"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nhà xuất bản",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên nhà xuất bản" />
                    </Form.Item>

                    <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                          label="Loại"
                          name="type"
                          rules={[
                            { required: true, message: "Vui lòng chọn loại" },
                          ]}
                        >
                          <Select
                            placeholder="Chọn loại"
                            onChange={(value) => {
                              console.log("Loại được chọn:", value);
                            }}
                          >
                            {selectType}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="Thể loại"
                          name="category"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn thể loại",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn thể loại"
                            onChange={(value) => {
                              console.log("Thể loại được chọn:", value);
                            }}
                          >
                            {selectCategory}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="Ngôn ngữ"
                          name="language"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ngôn ngữ",
                            },
                          ]}
                        >
                          <Select placeholder="Chọn ngôn ngữ">
                            <Select.Option value="vi">Tiếng Việt</Select.Option>
                            <Select.Option value="en">Tiếng Anh</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label="Năm xuất bản"
                          name="yearOfPublication"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập năm xuất bản",
                            },
                          ]}
                        >
                          <Input placeholder="Nhập năm xuất bản" />
                        </Form.Item>
                      </Col>
                      
                      <Col span={8}>
                        <Form.Item
                          label="Trạng thái mượn"
                          name="status"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn trạng thái mượn",
                            },
                          ]}
                        >
                          <Select placeholder="Chọn trạng thái mượn">
                            <Select.Option value="available">Cho mượn</Select.Option>
                            <Select.Option value="unavailable">Chỉ đọc tại thư viện</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="Số lượng"
                          name="quantity"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số lượng",
                            },
                          ]}
                        >
                          <Input placeholder="Nhập số lượng" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Mô tả"
                      name="description"

                    >
                      <Input.TextArea 
                        placeholder="Nhập mô tả sách" 
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        showCount
                        maxLength={500}
                      />
                    </Form.Item>
                  </Space>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  loading={uploading}
                  disabled={uploading}
                >
                  {uploading ? "Đang tải lên..." : "Thêm mới"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
