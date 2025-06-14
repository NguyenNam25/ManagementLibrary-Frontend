import { Input, Select, Button, Space } from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React from "react";

const { Option } = Select;

export default [
  {
    title: "Mã phiếu mượn",
    dataIndex: "ticketId",
    key: "ticketId",
    width: "17%",
  },
  {
    title: "Thẻ thư viện",
    dataIndex: "cardNumber",
    key: "cardNumber",
    width: "17%",
  },
  {
    title: "Ngày mượn",
    dataIndex: "borrowDate",
    key: "borrowDate",
    width: "15%",
    render: (date) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = d.getMonth().toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  {
    title: "Hạn trả",
    dataIndex: "expiredDate",
    key: "expiredDate",
    width: "13%",
    render: (date) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = d.getMonth().toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  {
    title: "Chi tiết",
    dataIndex: "detail",
    key: "detail",
    width: "10%",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: "15%",
    filters: [
      { text: "Đang mượn", value: "borrowed" },
      { text: "Đã trả", value: "returned" },
      { text: "Quá hạn", value: "expired" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => {
      let color = "blue";
      let text = "Đang mượn";

      if (status === "returned") {
        color = "green";
        text = "Đã trả";
      } else if (status === "expired") {
        color = "red";
        text = "Quá hạn";
      }

      return <span style={{ color }}>{text}</span>;
    },
  },
  {
    title: "Hành động",
    dataIndex: "actions",
    key: "actions",
    width: "15%",
  },
];
