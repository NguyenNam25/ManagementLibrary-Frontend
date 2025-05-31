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
      message.error("Failed to fetch rules");
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
      message.error("Failed to fetch services");
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
        message.success("Rule updated successfully");
      } else {
        await userApi.addRule("6832d36a8ed2b6384fa7d2b2", values);
        const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
        setRules(res.data.rules);
        message.success("Rule added successfully");
      }
      setIsRuleModalVisible(false);
      form.resetFields();
      setEditingRule(null);
    } catch (error) {
      message.error("Failed to save rule");
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
        message.success("Service updated successfully");
      } else {
        await userApi.addService("6832d36a8ed2b6384fa7d2b2", values);
        const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
        setServices(res.data.services);
        message.success("Service added successfully");
      }
      setIsServiceModalVisible(false);
      form.resetFields();
      setEditingService(null);
    } catch (error) {
      message.error("Failed to save service");
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      await userApi.deleteRuleById("6832d36a8ed2b6384fa7d2b2", id);
      const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
      setRules(res.data.rules);
      message.success("Rule deleted successfully");
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Failed to delete rule");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await userApi.deleteServiceById("6832d36a8ed2b6384fa7d2b2", id);
      const res = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
      setServices(res.data.services);
      message.success("Service deleted successfully");
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Failed to delete service");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <SideNav />
      <Layout style={{ background: "#f0f4f7", width: "100%" }}>
        <HeaderComponent />
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
              Library Rules
            </Title>
            <Text type="secondary">
              Manage and view library rules and regulations
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
                Rules List
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModalRule()}
              >
                Add New Rule
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
                Services List
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModalService()}
              >
                Add New Service
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
            title={editingRule ? "Edit Rule" : "Add New Rule"}
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
                label="Rule Name"
                rules={[
                  { required: true, message: "Please input the rule name!" },
                ]}
              >
                <Input placeholder="Enter rule name" />
              </Form.Item>

              <Form.Item
                name="detail"
                label="Rule Details"
                rules={[
                  { required: true, message: "Please input the rule details!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter rule details"
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
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {editingRule ? "Update" : "Add"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title={editingService ? "Edit Service" : "Add New Service"}
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
                label="Service Name"
                rules={[
                  { required: true, message: "Please input the service name!" },
                ]}
              >
                <Input placeholder="Enter service name" />
              </Form.Item>

              <Form.Item
                name="detail"
                label="Service Details"
                rules={[
                  { required: true, message: "Please input the service details!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter service details"
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
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {editingService ? "Update" : "Add"}
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
