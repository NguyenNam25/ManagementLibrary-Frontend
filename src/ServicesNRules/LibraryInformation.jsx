import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Divider,
  Form,
  Input,
  Button,
  Space,
  Upload,
  Modal,
  message,
  Breadcrumb,
} from "antd";
import {
  HomeOutlined,
  EditOutlined,
  SaveOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import SideNav from "../Layout/SideNav";
import HeaderComponent from "../Layout/Header";
import userApi from "../../api/user";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function LibraryInformation() {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [isHoursModalVisible, setIsHoursModalVisible] = useState(false);
  const [currentHourIndex, setCurrentHourIndex] = useState(null);
  const [hourForm] = Form.useForm();
  const [libInfo, setLibInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await userApi.getCurrentUser();
      setCurrentUser(response.data);
    };
    fetchCurrentUser();
  }, []);

  const fetchLibraryInfo = async () => {
    const response = await userApi.getUserById("6832d36a8ed2b6384fa7d2b2");
    setLibInfo(response.data.abouts);
  };

  useEffect(() => {
    if ("6832d36a8ed2b6384fa7d2b2") {
      fetchLibraryInfo();
    }
  }, [currentUser]);

  const libraryName = libInfo?.find(
    (item) => item.name === "libraryName"
  )?.detail;
  const libraryAbout = libInfo?.find((item) => item.name === "abouts")?.detail;
  const libraryPhone = libInfo?.find((item) => item.name === "phone")?.detail;
  const libraryEmail = libInfo?.find((item) => item.name === "email")?.detail;
  const libraryAddress = libInfo?.find(
    (item) => item.name === "address"
  )?.detail;
  const libraryWebsite = libInfo?.find(
    (item) => item.name === "website"
  )?.detail;
  const LibraryHours = libInfo?.filter((item) => item.type === "day");
  const logo = libInfo?.find((item) => item.name === "Logo")?.detail;

  console.log(logo);
  // Initialize the form with current library info when switching to edit mode
  const handleEditMode = () => {
    form.setFieldsValue({
      libraryName: libraryName,
      abouts: libraryAbout,
      phone: libraryPhone,
      email: libraryEmail,
      address: libraryAddress,
      website: libraryWebsite,
    });
    setEditMode(true);
  };

  const getCamelCaseKey = (field) =>
    field
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase())
      .replace(/^./, (str) => str.toLowerCase());
  // Save the updated information
  const handleSave = async (values) => {
    try {
      const fieldsToUpdate = [
        "Library name",
        "abouts",
        "phone",
        "email",
        "address",
        "website",
      ];

      const updates = fieldsToUpdate.map((field) => {
        const infoItem = libInfo.find((item) => item.name === field);
        if (!infoItem) return null;

        return userApi.updateLibInfoById("6832d36a8ed2b6384fa7d2b2", infoItem._id, {
          ...infoItem,
          detail: values[getCamelCaseKey(field)],
        });
      });

      await Promise.all(updates.filter(Boolean));
      // Refresh library info after updates
      await fetchLibraryInfo();
      setEditMode(false);
      message.success("Library information has been updated successfully");
    } catch (error) {
      console.error("Failed to update library information:", error);
      message.error("Failed to update library information. Please try again.");
    }
  };

  // Handle hours editing
  const showHoursModal = (libraryHours) => {
    const currentHour = libraryHours;
    hourForm.setFieldsValue({
      day: currentHour.name,
      hours: currentHour.detail,
    });
    setIsHoursModalVisible(true);
  };

  const handleAddHours = () => {
    hourForm.resetFields();
    setCurrentHourIndex(null);
    setIsHoursModalVisible(true);
  };

  const handleHoursOk = async () => {
    try {
      const values = await hourForm.validateFields();
      const existingDayIndex = libInfo.findIndex(
        (item) => item.name === values.day
      );

      if (existingDayIndex !== -1) {
        // Update existing day's hours
        const infoItem = libInfo[existingDayIndex];
        await userApi.updateLibInfoById("6832d36a8ed2b6384fa7d2b2", infoItem._id, {
          ...infoItem,
          detail: values.hours,
          type: "day",
        });
      } else {
        // Add new day's hours
        await userApi.addLibInfo("6832d36a8ed2b6384fa7d2b2", {
          name: values.day,
          detail: values.hours,
          type: "day",
        });
      }

      // Refresh library info after update
      await fetchLibraryInfo();
      setIsHoursModalVisible(false);
      message.success(
        `Hours ${existingDayIndex !== -1 ? "updated" : "added"} successfully`
      );
    } catch (error) {
      console.error("Operation failed:", error);
      message.error("Failed to save hours. Please try again.");
    }
  };

  const handleDeleteHours = (libraryHours) => {
    Modal.confirm({
      title: "Are you sure you want to delete these hours?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await userApi.deleteLibInfoById("6832d36a8ed2b6384fa7d2b2", libraryHours._id);
          await fetchLibraryInfo();
          message.success("Hours deleted successfully");
        } catch (error) {
          console.error("Error deleting hours:", error);
          message.error("Failed to delete hours. Please try again.");
        }
      },
    });
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  // Logo upload props
  const uploadProps = {
    name: "image",
    action: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users/6832d36a8ed2b6384fa7d2b2/abouts${libInfo?.find(item => item.name === "Logo") ? `/${libInfo.find(item => item.name === "Logo")._id}` : ''}`,
    method: libInfo?.find(item => item.name === "Logo") ? "put" : "post",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: {
      type: "info",
      name: "Logo",
    },
    multiple: false,
    maxCount: 1,
    accept: ".jpg,.png,.jpeg",
    beforeUpload: (file) => {
      // Check file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }

      // Check file size (5MB limit)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    onChange(info) {
      const { status, response } = info.file;
      const isUpdate = libInfo?.find(item => item.name === "Logo");
      
      if (status === 'uploading') {
        message.loading(isUpdate ? 'Updating logo...' : 'Uploading logo...');
      } else if (status === 'done') {
        message.success(isUpdate ? 'Logo updated successfully' : 'Logo uploaded successfully');
        // Refresh library info after successful upload
        fetchLibraryInfo();
      } else if (status === 'error') {
        const errorMsg = response?.message || (isUpdate ? 'Failed to update logo' : 'Failed to upload logo');
        message.error(errorMsg);
      }
    },
    onError(error) {
      message.error(`Upload failed: ${error.message || 'Unknown error'}`);
    },
    showUploadList: false
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
          <Breadcrumb style={{ marginBottom: "16px" }}>
            <Breadcrumb.Item href="/home">
              <HomeOutlined />
              <span>Home</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Library Information</Breadcrumb.Item>
          </Breadcrumb>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Library Information
              </Title>
              <Text type="secondary">
                View and update the library's information
              </Text>
            </div>
            <div>
              {editMode ? (
                <div>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    style={{ marginRight: "10px" }}
                    onClick={() => handleCancel()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => form.submit()}
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditMode}
                >
                  Edit Information
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          {editMode ? (
            // Edit Mode - Form
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={24}>
                  <Card
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Row gutter={[24, 24]} align="middle">
                      <Col xs={24} md={6} style={{ 
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "200px"
                      }}>
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "16px"
                        }}>
                          <img
                            src={logo}
                            alt="Library Logo"
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                            }}
                          />
                          {editMode && (
                            <Upload {...uploadProps}>
                              <Button icon={<UploadOutlined />}>Change Logo</Button>
                            </Upload>
                          )}
                        </div>
                      </Col>
                      <Col xs={24} md={18}>
                        <Form.Item
                          label="Library Name"
                          name="libraryName"
                          rules={[
                            {
                              required: true,
                              message: "Please enter the library name",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="About"
                          name="abouts"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please enter information about the library",
                            },
                          ]}
                        >
                          <TextArea rows={4} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card
                    title="Contact Information"
                    style={{
                      height: "100%",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Form.Item
                      label="Phone"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the phone number",
                        },
                      ]}
                    >
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the email address",
                        },
                        {
                          type: "email",
                          message: "Please enter a valid email address",
                        },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item
                      label="Address"
                      name="address"
                      rules={[
                        { required: true, message: "Please enter the address" },
                      ]}
                    >
                      <TextArea rows={3} prefix={<EnvironmentOutlined />} />
                    </Form.Item>
                    <Form.Item
                      label="Website"
                      name="website"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the website URL",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>Library Hours</span>
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={handleAddHours}
                        >
                          Add Hours
                        </Button>
                      </div>
                    }
                    style={{
                      height: "100%",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {LibraryHours.map((item) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <div>
                          <Text strong>{item?.name}</Text>
                          <br />
                          <Text>{item?.detail}</Text>
                        </div>
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showHoursModal(item)}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteHours(item)}
                          />
                        </Space>
                      </div>
                    ))}
                  </Card>
                </Col>
              </Row>
            </Form>
          ) : (
            // View Mode
            <Row gutter={[24, 24]}>
              <Col xs={24} md={24}>
                <Card
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={6} style={{ 
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "200px"
                    }}>
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "16px"
                      }}>
                        <img
                          src={logo}
                          alt="Library Logo"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                          }}
                        />
                      </div>
                    </Col>
                    <Col xs={24} md={18}>
                      <Title level={3}>{libraryName}</Title>
                      <Paragraph>{libraryAbout}</Paragraph>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title={
                    <>
                      <PhoneOutlined /> Contact Information
                    </>
                  }
                  style={{
                    height: "100%",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div style={{ marginBottom: "16px" }}>
                    <Text strong>Phone:</Text>
                    <Paragraph>{libraryPhone}</Paragraph>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <Text strong>Email:</Text>
                    <Paragraph>{libraryEmail}</Paragraph>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <Text strong>Address:</Text>
                    <Paragraph>{libraryAddress}</Paragraph>
                  </div>
                  <div>
                    <Text strong>Website:</Text>
                    <Paragraph>{libraryWebsite}</Paragraph>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title={
                    <>
                      <ClockCircleOutlined /> Library Hours
                    </>
                  }
                  style={{
                    height: "100%",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  {LibraryHours?.map((item) => (
                    <div style={{ marginBottom: "12px" }}>
                      <Text strong>{item?.name}</Text>
                      <Paragraph>{item?.detail}</Paragraph>
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          )}
        </Content>
      </Layout>

      {/* Modal for editing library hours */}
      <Modal
        title={currentHourIndex !== null ? "Edit Hours" : "Add Hours"}
        open={isHoursModalVisible}
        onOk={handleHoursOk}
        onCancel={() => setIsHoursModalVisible(false)}
      >
        <Form form={hourForm} layout="vertical">
          <Form.Item
            name="day"
            label="Day/Days"
            rules={[
              { required: true, message: "Please enter the day or days" },
            ]}
          >
            <Input placeholder="e.g., Monday - Thursday, Sunday" />
          </Form.Item>
          <Form.Item
            name="hours"
            label="Hours"
            rules={[{ required: true, message: "Please enter the hours" }]}
          >
            <Input placeholder="e.g., 9:00 AM - 6:00 PM, Closed" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}