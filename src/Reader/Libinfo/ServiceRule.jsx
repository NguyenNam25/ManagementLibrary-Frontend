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
    { day: "Thứ Hai - Thứ Sáu", hours: "9:00 - 21:00" },
    { day: "Thứ Bảy", hours: "10:00 - 18:00" },
    { day: "Chủ Nhật", hours: "12:00 - 17:00" },
    { day: "Ngày lễ", hours: "Đóng cửa" }
  ];

  // Special Hours Data
  const specialHours = [
    { period: "Nghỉ hè (1/6 - 31/8)", hours: "10:00 - 19:00" },
    { period: "Nghỉ đông (20/12 - 5/1)", hours: "11:00 - 17:00" },
    { period: "Tuần thi", hours: "8:00 - 23:00" }
  ];

  // Borrowing Rules Data
  const borrowingRules = [
    {
      itemType: "Sách",
      loanPeriod: "14 ngày",
      limit: "5 cuốn",
      renewals: "2 lần (nếu không có người đặt trước)",
      fineRate: "0.25$ mỗi ngày"
    },
    {
      itemType: "Sách tham khảo",
      loanPeriod: "Chỉ sử dụng tại thư viện",
      limit: "Không cho mượn",
      renewals: "Không áp dụng",
      fineRate: "Không áp dụng"
    },
    {
      itemType: "Tạp chí/Tạp san",
      loanPeriod: "7 ngày",
      limit: "3 cuốn",
      renewals: "1 lần",
      fineRate: "0.50$ mỗi ngày"
    },
    {
      itemType: "DVD/Phương tiện",
      loanPeriod: "3 ngày",
      limit: "2 cuốn",
      renewals: "Không cho phép",
      fineRate: "1.00$ mỗi ngày"
    }
  ];

  // Borrowing Steps
  const borrowingSteps = [
    {
      title: "Tìm sách",
      description: "Tìm kiếm sách bằng danh mục hoặc duyệt qua kệ sách."
    },
    {
      title: "Kiểm tra tính khả dụng",
      description: "Đảm bảo sách có sẵn để mượn."
    },
    {
      title: "Đến quầy dịch vụ",
      description: "Mang sách đến quầy dịch vụ hoặc sử dụng máy tự phục vụ."
    },
    {
      title: "Trình thẻ thư viện",
      description: "Xuất trình thẻ thư viện hoặc sử dụng ứng dụng."
    },
    {
      title: "Xác nhận mượn",
      description: "Nhận xác nhận ngày trả sách."
    }
  ];

  // Library Services
  const libraryServices = [
    {
      title: "Truy cập máy tính",
      icon: <DesktopOutlined />,
      description: "Truy cập miễn phí vào máy tính có internet và phần mềm văn phòng. Giới hạn 2 giờ mỗi phiên."
    },
    {
      title: "Wi-Fi",
      icon: <WifiOutlined />,
      description: "Wi-Fi miễn phí trong toàn bộ thư viện. Kết nối với mạng 'Library_Public'."
    },
    {
      title: "In ấn & Sao chép",
      icon: <PrinterOutlined />,
      description: "Đen trắng: 0.10$/trang. Màu: 0.50$/trang. Quét gửi email miễn phí."
    },
    {
      title: "Phòng học nhóm",
      icon: <TeamOutlined />,
      description: "Phòng học nhóm có sẵn theo đặt trước. Tối đa 3 giờ mỗi ngày."
    },
    {
      title: "Hỗ trợ tham khảo",
      icon: <InfoCircleOutlined />,
      description: "Thủ thư sẵn sàng hỗ trợ nghiên cứu và tìm tài liệu."
    }
  ];

  // Conduct Rules
  const conductRules = [
    "Giữ yên tĩnh trong khu vực được chỉ định",
    "Không ăn uống gần máy tính hoặc kệ sách",
    "Điện thoại di động nên để im lặng",
    "Tôn trọng người dùng thư viện khác và nhân viên",
    "Không làm hư hỏng hoặc đánh dấu tài liệu thư viện",
    "Trẻ em dưới 12 tuổi phải được giám sát bởi người lớn",
    "Không mang tài liệu thư viện ra ngoài mà không mượn đúng cách",
    "Tuân theo tất cả quy định về sử dụng máy tính",
    "Không ngủ trong thư viện",
    "Không quảng cáo hoặc phát tán tài liệu mà không được phép"
  ];

  // Fines and Fees
  const finesAndFees = [
    { item: "Sách quá hạn", fee: "0.25$ mỗi ngày (tối đa 10$ mỗi cuốn)" },
    { item: "DVD/Phương tiện quá hạn", fee: "1.00$ mỗi ngày (tối đa 20$ mỗi cuốn)" },
    { item: "Mất hoặc hư hỏng", fee: "Chi phí thay thế + 5$ phí xử lý" },
    { item: "Thẻ thư viện thay thế", fee: "2.00$" },
    { item: "In đen trắng", fee: "0.10$ mỗi trang" },
    { item: "In màu", fee: "0.50$ mỗi trang" },
    { item: "Hủy phòng học muộn", fee: "5.00$" }
  ];

  // Table columns for borrowing rules
  const borrowingColumns = [
    {
      title: "Loại tài liệu",
      dataIndex: "itemType",
      key: "itemType",
    },
    {
      title: "Thời hạn mượn",
      dataIndex: "loanPeriod",
      key: "loanPeriod",
    },
    {
      title: "Giới hạn",
      dataIndex: "limit",
      key: "limit",
    },
    {
      title: "Gia hạn",
      dataIndex: "renewals",
      key: "renewals",
    },
    {
      title: "Phí trễ hạn",
      dataIndex: "fineRate",
      key: "fineRate",
    }
  ];

  // Rules Data
  const rulesData = [
    {
      title: "Quy định mượn sách",
      icon: <BookOutlined />,
      description: "Sách có thể được mượn trong 14 ngày, giới hạn 5 cuốn. Sách tham khảo chỉ sử dụng tại thư viện. Tạp chí có thể mượn trong 7 ngày, và DVD trong 3 ngày. Áp dụng phí trễ hạn cho sách quá hạn."
    },
    {
      title: "Phí và lệ phí",
      icon: <WarningOutlined />,
      description: "Sách quá hạn: 0.25$ mỗi ngày. DVD: 1.00$ mỗi ngày. Mất sách: chi phí thay thế + 5$ phí. Quyền sử dụng thư viện sẽ bị tạm đình chỉ nếu phí vượt quá 10.00$."
    },
    {
      title: "Quy trình mượn sách",
      icon: <FileDoneOutlined />,
      description: "Tìm sách, kiểm tra tính khả dụng, mang đến quầy dịch vụ, trình thẻ thư viện và nhận xác nhận ngày trả. Bạn có thể gia hạn sách tối đa 2 lần nếu không có người đặt trước."
    },
    {
      title: "Quy tắc thư viện",
      icon: <InfoCircleOutlined />,
      description: "Giữ yên tĩnh, không ăn uống gần máy tính, im lặng điện thoại, tôn trọng người khác và không làm hư hỏng tài liệu. Trẻ em dưới 12 tuổi phải được giám sát."
    },
    {
      title: "Truy cập kỹ thuật số",
      icon: <DesktopOutlined />,
      description: "Truy cập sách điện tử, sách nói và tài nguyên kỹ thuật số bằng thẻ thư viện. Wi-Fi miễn phí và truy cập máy tính có sẵn với giới hạn 2 giờ mỗi phiên."
    },
    {
      title: "Không gian học tập",
      icon: <TeamOutlined />,
      description: "Phòng học nhóm có sẵn theo đặt trước tối đa 3 giờ mỗi ngày. Khu vực học tập yên tĩnh được chỉ định trong toàn bộ thư viện."
    }
  ];

  return (
    <Layout>
      <div>
        <ReaderNav />
      </div>
      <Content style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "calc(100vh - 64px)" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Dịch vụ & Quy định thư viện
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          style={{ marginBottom: 32 }}
        >
          <TabPane 
            tab={<span><ClockCircleOutlined /> Giờ mở cửa & Vị trí</span>} 
            key="1"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card title="Giờ mở cửa thông thường" bordered={false}>
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
                  
                  <Divider orientation="left">Giờ đặc biệt</Divider>
                  
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
                    message="Ngày nghỉ lễ"
                    description="Thư viện đóng cửa vào tất cả các ngày lễ liên bang. Giờ mở cửa đặc biệt có thể áp dụng trước và sau ngày lễ."
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card title="Vị trí & Thông tin liên hệ" bordered={false}>
                  <Paragraph>
                    <Space>
                      <EnvironmentOutlined />
                      <Text strong>Địa chỉ:</Text>
                    </Space>
                    <div style={{ marginLeft: 24, marginBottom: 16 }}>
                      123 Đường Thư viện,<br />
                      Thành phố Học thuật, 10001
                    </div>
                    
                    <Space>
                      <PhoneOutlined />
                      <Text strong>Điện thoại:</Text>
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
                    message="Khả năng tiếp cận"
                    description="Thư viện của chúng tôi hoàn toàn có thể tiếp cận cho người khuyết tật. Có sẵn đường dốc, thang máy và nhà vệ sinh dành cho người khuyết tật."
                    type="success"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane 
            tab={<span><BookOutlined /> Quy định</span>} 
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
            tab={<span><FileDoneOutlined /> Dịch vụ có sẵn</span>} 
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

            <Divider orientation="left" style={{ marginTop: 24 }}>Dịch vụ bổ sung</Divider>

            <Collapse defaultActiveKey={['1']} style={{ marginBottom: 24 }}>
              <Panel header="Mượn liên thư viện" key="1">
                <Paragraph>
                  Tài liệu không có trong bộ sưu tập của chúng tôi có thể được yêu cầu thông qua dịch vụ Mượn liên thư viện.
                  Yêu cầu thường mất 1-2 tuần để thực hiện. Phí xử lý 3$ áp dụng cho mỗi yêu cầu.
                </Paragraph>
              </Panel>
              <Panel header="Hỗ trợ nghiên cứu" key="2">
                <Paragraph>
                  Thủ thư sẵn sàng hỗ trợ nhu cầu nghiên cứu. Đặt lịch hẹn một-một hoặc
                  đến quầy tham khảo trong giờ làm việc. Chúng tôi có thể hỗ trợ nghiên cứu học thuật, truy cập cơ sở dữ liệu,
                  định dạng trích dẫn và nhiều hơn nữa.
                </Paragraph>
              </Panel>
              <Panel header="Sự kiện & Chương trình thư viện" key="3">
                <Paragraph>
                  Thư viện tổ chức nhiều sự kiện bao gồm nói chuyện với tác giả, câu lạc bộ sách, hội thảo và
                  chương trình giáo dục. Kiểm tra lịch sự kiện trên trang web của chúng tôi hoặc hỏi tại quầy thông tin về
                  các sự kiện sắp tới.
                </Paragraph>
              </Panel>
              <Panel header="Tài nguyên kỹ thuật số" key="4">
                <Paragraph>
                  Người dùng thẻ thư viện có quyền truy cập vào nhiều tài nguyên trực tuyến bao gồm sách điện tử, sách nói,
                  tạp chí kỹ thuật số, cơ sở dữ liệu nghiên cứu và nền tảng học tập. Có thể truy cập từ nhà
                  bằng số thẻ thư viện và mã PIN của bạn.
                </Paragraph>
              </Panel>
            </Collapse>

            <Alert
              message="Yêu cầu dịch vụ"
              description="Đối với dịch vụ chuyên biệt hoặc hỗ trợ không được liệt kê ở đây, vui lòng liên hệ nhân viên thư viện tại quầy thông tin hoặc gọi (123) 456-7890."
              type="info"
              showIcon
            />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}
