import React, { useState } from "react";
import {
  Layout,
  Typography,
  Tabs,
  Card,
  List,
  Divider,
  Timeline,
  Tag,
  Row,
  Col,
  Alert,
  Steps,
  Table,
  Collapse,
  Space
} from "antd";
import {
  ClockCircleOutlined,
  BookOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  DesktopOutlined,
  PrinterOutlined,
  WifiOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import ReaderNav from "../Layout/ReaderNav";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Step } = Steps;

export default function ServiceRule() {
  const [activeTab, setActiveTab] = useState("1");

  // Library Hours Data
  const libraryHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 9:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "12:00 PM - 5:00 PM" },
    { day: "Public Holidays", hours: "Closed" }
  ];

  // Special Hours Data
  const specialHours = [
    { period: "Summer Break (June 1 - August 31)", hours: "10:00 AM - 7:00 PM" },
    { period: "Winter Break (December 20 - January 5)", hours: "11:00 AM - 5:00 PM" },
    { period: "Exam Weeks", hours: "8:00 AM - 11:00 PM" }
  ];

  // Borrowing Rules Data
  const borrowingRules = [
    {
      itemType: "Books",
      loanPeriod: "14 days",
      limit: "5 items",
      renewals: "2 times (if not reserved)",
      fineRate: "$0.25 per day"
    },
    {
      itemType: "Reference Books",
      loanPeriod: "Library use only",
      limit: "Not for loan",
      renewals: "N/A",
      fineRate: "N/A"
    },
    {
      itemType: "Journals/Magazines",
      loanPeriod: "7 days",
      limit: "3 items",
      renewals: "1 time",
      fineRate: "$0.50 per day"
    },
    {
      itemType: "DVDs/Media",
      loanPeriod: "3 days",
      limit: "2 items",
      renewals: "None",
      fineRate: "$1.00 per day"
    }
  ];

  // Borrowing Steps
  const borrowingSteps = [
    {
      title: "Find Item",
      description: "Search for items using the catalog or browse the shelves."
    },
    {
      title: "Check Availability",
      description: "Ensure the item is available for borrowing."
    },
    {
      title: "Take to Service Desk",
      description: "Bring the item to the service desk or use the self-checkout kiosk."
    },
    {
      title: "Present Library Card",
      description: "Show your library card or use your app."
    },
    {
      title: "Confirm Loan",
      description: "Receive confirmation of the due date."
    }
  ];

  // Library Services
  const libraryServices = [
    {
      title: "Computer Access",
      icon: <DesktopOutlined />,
      description: "Free access to computers with internet and productivity software. 2-hour time limit per session."
    },
    {
      title: "Wi-Fi",
      icon: <WifiOutlined />,
      description: "Free Wi-Fi throughout the library. Connect to 'Library_Public' network."
    },
    {
      title: "Printing & Copying",
      icon: <PrinterOutlined />,
      description: "Black & white: $0.10/page. Color: $0.50/page. Scan to email is free."
    },
    {
      title: "Study Rooms",
      icon: <TeamOutlined />,
      description: "Group study rooms available by reservation. Up to 3 hours per day."
    },
    {
      title: "Reference Assistance",
      icon: <InfoCircleOutlined />,
      description: "Librarians available to help with research and finding materials."
    }
  ];

  // Conduct Rules
  const conductRules = [
    "Maintain a quiet environment in designated areas",
    "No food or drinks near computers or book collections",
    "Cell phones should be silenced",
    "Respect other library users and staff",
    "Do not damage or mark library materials",
    "Children under 12 must be supervised by an adult",
    "No removal of library materials without proper checkout",
    "Follow all posted rules regarding computer use",
    "No sleeping in the library",
    "No solicitation or distribution of materials without permission"
  ];

  // Fines and Fees
  const finesAndFees = [
    { item: "Overdue Books", fee: "$0.25 per day (max $10 per item)" },
    { item: "Overdue DVDs/Media", fee: "$1.00 per day (max $20 per item)" },
    { item: "Lost or Damaged Items", fee: "Replacement cost + $5 processing fee" },
    { item: "Replacement Library Card", fee: "$2.00" },
    { item: "Printing (B&W)", fee: "$0.10 per page" },
    { item: "Printing (Color)", fee: "$0.50 per page" },
    { item: "Late Study Room Cancellation", fee: "$5.00" }
  ];

  // Table columns for borrowing rules
  const borrowingColumns = [
    {
      title: "Item Type",
      dataIndex: "itemType",
      key: "itemType",
    },
    {
      title: "Loan Period",
      dataIndex: "loanPeriod",
      key: "loanPeriod",
    },
    {
      title: "Item Limit",
      dataIndex: "limit",
      key: "limit",
    },
    {
      title: "Renewals",
      dataIndex: "renewals",
      key: "renewals",
    },
    {
      title: "Late Fees",
      dataIndex: "fineRate",
      key: "fineRate",
    }
  ];

  // Rules Data
  const rulesData = [
    {
      title: "Borrowing Rules",
      icon: <BookOutlined />,
      description: "Books can be borrowed for 14 days, with a limit of 5 items. Reference books are for library use only. Journals can be borrowed for 7 days, and DVDs for 3 days. Late fees apply for overdue items."
    },
    {
      title: "Fines and Fees",
      icon: <WarningOutlined />,
      description: "Overdue books: $0.25 per day. DVDs: $1.00 per day. Lost items: replacement cost + $5 fee. Library privileges are suspended if fines exceed $10.00."
    },
    {
      title: "Borrowing Process",
      icon: <FileDoneOutlined />,
      description: "Find your item, check availability, bring it to the service desk, present your library card, and receive confirmation of the due date. You can renew items up to 2 times if not reserved."
    },
    {
      title: "Library Conduct",
      icon: <InfoCircleOutlined />,
      description: "Maintain a quiet environment, no food near computers, silence cell phones, respect others, and do not damage materials. Children under 12 must be supervised."
    },
    {
      title: "Digital Access",
      icon: <DesktopOutlined />,
      description: "Access e-books, audiobooks, and digital resources using your library card. Free Wi-Fi and computer access available with a 2-hour time limit per session."
    },
    {
      title: "Study Spaces",
      icon: <TeamOutlined />,
      description: "Group study rooms available by reservation for up to 3 hours per day. Quiet study areas are designated throughout the library."
    }
  ];

  return (
    <Layout>
      <div>
        <ReaderNav />
      </div>
      <Content style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "calc(100vh - 64px)" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Library Services & Rules
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          style={{ marginBottom: 32 }}
        >
          <TabPane 
            tab={<span><ClockCircleOutlined /> Hours & Location</span>} 
            key="1"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card title="Regular Library Hours" bordered={false}>
                  <List
                    itemLayout="horizontal"
                    dataSource={libraryHours}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<ClockCircleOutlined style={{ fontSize: 18 }} />}
                          title={<Text strong>{item.day}</Text>}
                          description={item.hours}
                        />
                      </List.Item>
                    )}
                  />
                  
                  <Divider orientation="left">Special Hours</Divider>
                  
                  <List
                    itemLayout="horizontal"
                    dataSource={specialHours}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Text strong>{item.period}</Text>}
                          description={item.hours}
                        />
                      </List.Item>
                    )}
                  />

                  <Alert
                    message="Holiday Closures"
                    description="The library is closed on all federal holidays. Special hours may apply before and after holidays."
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card title="Location & Contact Information" bordered={false}>
                  <Paragraph>
                    <Space>
                      <EnvironmentOutlined />
                      <Text strong>Address:</Text>
                    </Space>
                    <div style={{ marginLeft: 24, marginBottom: 16 }}>
                      123 Library Street,<br />
                      Academic City, 10001
                    </div>
                    
                    <Space>
                      <PhoneOutlined />
                      <Text strong>Phone:</Text>
                    </Space>
                    <div style={{ marginLeft: 24, marginBottom: 16 }}>
                      (123) 456-7890
                    </div>
                    
                    <Space>
                      <InfoCircleOutlined />
                      <Text strong>Email:</Text>
                    </Space>
                    <div style={{ marginLeft: 24, marginBottom: 16 }}>
                      info@libraryreader.com
                    </div>
                  </Paragraph>

                  <Alert
                    message="Accessibility"
                    description="Our library is fully accessible for individuals with disabilities. Ramps, elevators, and accessible restrooms are available."
                    type="success"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane 
            tab={<span><BookOutlined /> Rules</span>} 
            key="2"
          >
            <Row gutter={[24, 24]}>
              {rulesData.map(rule => (
                <Col xs={24} sm={12} md={8} key={rule.title}>
                  <Card
                    title={
                      <Space>
                        {rule.icon}
                        <span>{rule.title}</span>
                      </Space>
                    }
                    bordered={false}
                    style={{ height: '100%' }}
                  >
                    <Paragraph>{rule.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane 
            tab={<span><FileDoneOutlined /> Available Services</span>} 
            key="3"
          >
            <Row gutter={[24, 24]}>
              {libraryServices.map(service => (
                <Col xs={24} sm={12} md={8} key={service.title}>
                  <Card
                    title={
                      <Space>
                        {service.icon}
                        <span>{service.title}</span>
                      </Space>
                    }
                    bordered={false}
                    style={{ height: '100%' }}
                  >
                    <Paragraph>{service.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>

            <Divider orientation="left" style={{ marginTop: 24 }}>Additional Services</Divider>

            <Collapse defaultActiveKey={['1']} style={{ marginBottom: 24 }}>
              <Panel header="Interlibrary Loans" key="1">
                <Paragraph>
                  Items not available in our collection may be requested through our Interlibrary Loan service.
                  Requests typically take 1-2 weeks to fulfill. A $3 processing fee applies to each request.
                </Paragraph>
              </Panel>
              <Panel header="Research Assistance" key="2">
                <Paragraph>
                  Librarians are available to help with research needs. Schedule a one-on-one appointment or
                  visit the reference desk during staffed hours. We can assist with academic research, database access,
                  citation formatting, and more.
                </Paragraph>
              </Panel>
              <Panel header="Library Events & Programs" key="3">
                <Paragraph>
                  The library hosts various events including author talks, book clubs, workshops, and
                  educational programs. Check the events calendar on our website or ask at the information desk for
                  upcoming events.
                </Paragraph>
              </Panel>
              <Panel header="Digital Resources" key="4">
                <Paragraph>
                  Library card holders have access to various online resources including e-books, audiobooks,
                  digital magazines, research databases, and learning platforms. These can be accessed from home
                  using your library card number and PIN.
                </Paragraph>
              </Panel>
            </Collapse>

            <Alert
              message="Service Requests"
              description="For specialized services or assistance not listed here, please contact the library staff at the information desk or call (123) 456-7890."
              type="info"
              showIcon
            />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}
