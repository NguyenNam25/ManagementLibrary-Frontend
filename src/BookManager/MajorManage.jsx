import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  message,
  Modal,
  Row,
  Col,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import HeaderComponent from "../Layout/Header";
import SideNav from "../Layout/SideNav";
import majorApi from "../../api/major";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function MajorManage() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'category' or 'type'
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, typesRes] = await Promise.all([
        majorApi.getAllCategories(),
        majorApi.getAllTypes()
      ]);
      setCategories(categoriesRes.data);
      setTypes(typesRes.data);
    } catch (error) {
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (modalType === 'category') {
        const data = {
          name: values.name,
          kind: 'category',
        }
        await majorApi.createCategory(data);
      } else {
        const data = {
          name: values.name,
          kind: 'type',
        }
        await majorApi.createType(data);
      }
      message.success(`${modalType === 'category' ? 'Category' : 'Type'} added successfully`);
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || `Failed to save ${modalType}`);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === 'category') {
        await majorApi.deleteCategory(id);
      } else {
        await majorApi.deleteType(id);
      }
      message.success(`${type === 'category' ? 'Category' : 'Type'} deleted successfully`);
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const showModal = (type) => {
    setModalType(type);
    form.resetFields();
    setIsModalVisible(true);
  };

  const renderBlock = (item, type) => (
    <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
      <Card
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text strong>{item.name}</Text>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(item._id, type)}
          />
        </div>
      </Card>
    </Col>
  );

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <SideNav />
      <Layout style={{ background: "#f0f4f7", width: "100%" }}>
        <HeaderComponent title="Quản lý sách" />
        <Content
          style={{
            margin: 0,
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
            width: "100%",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý danh mục
            </Title>
            <Text type="secondary">
              Quản lý loại và thể loại sách trong thư viện
            </Text>
          </div>

          {/* Categories Section */}
          <Card
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Categories
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal('category')}
              >
                Add Category
              </Button>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Row gutter={[16, 16]}>
              {categories.map((category) => renderBlock(category, 'category'))}
            </Row>
          </Card>

          {/* Types Section */}
          <Card
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Types
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal('type')}
              >
                Add Type
              </Button>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Row gutter={[16, 16]}>
              {types.map((type) => renderBlock(type, 'type'))}
            </Row>
          </Card>

          <Modal
            title={`Add New ${modalType === 'category' ? 'Category' : 'Type'}`}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: `Please input the ${modalType} name!` },
                ]}
              >
                <Input placeholder={`Enter ${modalType} name`} />
              </Form.Item>

              <Form.Item>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => {
                      setIsModalVisible(false);
                      form.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Add
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
