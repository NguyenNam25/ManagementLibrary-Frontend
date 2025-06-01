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
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import userApi from "../../api/user";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Rules() {
  const [form] = Form.useForm();
  const [rules, setRules] = useState();
  const [services, setServices] = useState();
  const [isRuleModalVisible, setIsRuleModalVisible] = useState(false);
  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const { Content } = Layout;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await userApi.getCurrentUser();
      setCurrentUser(response.data);
    };
    fetchCurrentUser();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
      setRules(response.data.rules);
    } catch (error) {
      message.error("Lấy quy định thất bại");
    }
  };

  useEffect(() => {
    if ("6832d36a8ed2b6384fa7d2b2") {
      fetchRules();
    }
  }, []);

  const fetchServices = async () => {
    try {
      const response = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
      setServices(response.data.services);
    } catch (error) {
      message.error("Lấy dịch vụ thất bại");
    }
  };  

  useEffect(() => {
    if ("6832d36a8ed2b6384fa7d2b2") {
      fetchServices();
    }
  }, []);

  const showModalRule = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      form.setFieldsValue({
        name: rule.name,
        detail: rule.detail,
      });
    } else {
      form.resetFields();
      setEditingRule(null);
    }
    setIsRuleModalVisible(true);
  };

  const showModalService = (service = null) => {
    if (service) {
      setEditingService(service);
      form.setFieldsValue({
        name: service.name,
        detail: service.detail,
      });
    } else {
      form.resetFields();
      setEditingService(null);
    }
    setIsServiceModalVisible(true);
  };

  const handleSubmitRule = async (values) => {
    try {
      if (editingRule) {
        await userApi.updateRuleById(
          "6832d36a8ed2b6384fa7d2b2",
          editingRule._id,
          values
        );
        const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
        setRules(res.data.rules);
        message.success("Quy định đã được cập nhật thành công");
      } else {
        await userApi.addRule("6832d36a8ed2b6384fa7d2b2", values);
        const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
        setRules(res.data.rules);
        message.success("Quy định đã được thêm thành công");
      }
      setIsRuleModalVisible(false);
      form.resetFields();
      setEditingRule(null);
    } catch (error) {
      message.error("Cập nhật quy định thất bại");
    }
  };

  const handleSubmitService = async (values) => {
    try {
      if (editingService) {
        await userApi.updateServiceById(
          "6832d36a8ed2b6384fa7d2b2",
          editingService._id,
          values
        );
        const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
        setServices(res.data.services);
        message.success("Dịch vụ đã được cập nhật thành công");
      } else {
        await userApi.addService("6832d36a8ed2b6384fa7d2b2", values);
        const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
        setServices(res.data.services);
        message.success("Dịch vụ đã được thêm thành công");
      }
      setIsServiceModalVisible(false);
      form.resetFields();
      setEditingService(null);
    } catch (error) {
      message.error("Cập nhật dịch vụ thất bại");
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      await userApi.deleteRuleById("6832d36a8ed2b6384fa7d2b2", id);
      const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
      setRules(res.data.rules);
      message.success("Quy định đã được xóa thành công");
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Xóa quy định thất bại");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await userApi.deleteServiceById("6832d36a8ed2b6384fa7d2b2", id);
      const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
      setServices(res.data.services);
      message.success("Dịch vụ đã được xóa thành công");
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Xóa dịch vụ thất bại");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <SideNav />
      <Layout style={{ background: "#f0f4f7", width: "100%" }}>
        <HeaderComponent title="Quản lý thông tin thư viện" />
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
              Quy định thư viện
            </Title>
            <Text type="secondary">
              Quản lý và xem quy định của thư viện
            </Text>
          </div>

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
                Danh sách quy định
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModalRule()}
              >
                Thêm quy định mới
              </Button>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Row gutter={[24, 24]}>
              {rules?.map((rule) => (
                <Col xs={24} md={8} key={rule._id}>
                  <Card
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        {rule.name}
                      </Title>
                      <Space>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => showModalRule(rule)}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteRule(rule._id)}
                        />
                      </Space>
                    </div>
                    <Divider style={{ margin: "12px 0" }} />
                    <Text>{rule.detail}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Services */}
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
                Danh sách dịch vụ
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModalService()}
              >
                Thêm dịch vụ mới
              </Button>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Row gutter={[24, 24]}>
              {services?.map((service) => (
                <Col xs={24} md={8} key={service._id}>
                  <Card
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        {service.name}
                      </Title>
                      <Space>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => showModalService(service)}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteService(service._id)}
                        />
                      </Space>
                    </div>
                    <Divider style={{ margin: "12px 0" }} />
                    <Text>{service.detail}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Modal
            title={editingRule ? "Chỉnh sửa quy định" : "Thêm quy định mới"}
            open={isRuleModalVisible}
            onCancel={() => {
              setIsRuleModalVisible(false);
              form.resetFields();
              setEditingRule(null);
            }}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmitRule}>
              <Form.Item
                name="name"
                label="Tên quy định"
                rules={[
                  { required: true, message: "Vui lòng nhập tên quy định!" },
                ]}
              >
                <Input placeholder="Nhập tên quy định" />
              </Form.Item>

              <Form.Item
                name="detail"
                label="Chi tiết quy định"
                rules={[
                  { required: true, message: "Vui lòng nhập chi tiết quy định!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập chi tiết quy định"
                  style={{ resize: "none" }}
                />
              </Form.Item>

              <Form.Item>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => {
                      setIsRuleModalVisible(false);
                      form.resetFields();
                      setEditingRule(null);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {editingRule ? "Cập nhật" : "Thêm"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title={editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
            open={isServiceModalVisible}
            onCancel={() => {
              setIsServiceModalVisible(false);
              form.resetFields();
              setEditingService(null);
            }}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmitService}>
              <Form.Item
                name="name"
                label="Tên dịch vụ"
                rules={[
                  { required: true, message: "Vui lòng nhập tên dịch vụ!" },
                ]}
              >
                <Input placeholder="Nhập tên dịch vụ" />
              </Form.Item>

              <Form.Item
                name="detail"
                label="Chi tiết dịch vụ"
                rules={[
                  { required: true, message: "Vui lòng nhập chi tiết dịch vụ!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập chi tiết dịch vụ"
                  style={{ resize: "none" }}
                />
              </Form.Item>

              <Form.Item>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => {
                      setIsServiceModalVisible(false);
                      form.resetFields();
                      setEditingService(null);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {editingService ? "Cập nhật" : "Thêm"}
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
