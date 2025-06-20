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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import majorApi from "../../api/major/index.js";
import bookApi from "../../api/book/index.js";
import ImageDragger from "./ImageDragger";
import axios from "axios";

const { Title, Text } = Typography;

export default function UpdateBook() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const [types, setType] = useState([]);
  const [categories, setCategory] = useState([]);
  const [book, setBook] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (state) {
      const fetchBook = async () => {
        const bookResponse = await bookApi.getBookById(state.id);
        setBook(bookResponse.data);
        form.setFieldsValue(bookResponse.data);
      };
      fetchBook();
    }
  }, [state]);

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
      Object.keys(values).forEach((key) => {
        console.log(key, values[key]);
        if (key === "image" && values[key]) {
          formData.append("image", values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await bookApi.updateBook(id, formData);

      if (response.status === 201) {
        message.success("Cập nhật sách thành công");
        form.resetFields();
        navigate("/book-list");
      }
    } catch (error) {
      message.error("Cập nhật sách thất bại");
      console.error("Error creating book:", error);
    } finally {
      setUploading(false);
    }
  };

  const { Content } = Layout;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideNav />
      <Layout style={{ background: "#f0f4f7", width: "100%" }}>
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
              Cập nhật sách
            </Title>
            <Text type="secondary">Cập nhật thông tin sách</Text>
          </div>
          <Card
            title="Cập nhật sách"
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
                  <Space direction="vertical" style={{ width: "100%" }}>
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
                            <Select.Option value="available">
                              Cho mượn
                            </Select.Option>
                            <Select.Option value="unavailable">
                              Chỉ đọc tại thư viện
                            </Select.Option>
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
                  </Space>
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
                </Col>
              </Row>
              <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
                <Button type="primary" htmlType="submit" size="large">
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
