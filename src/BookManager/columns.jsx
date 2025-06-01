import React from "react";

export default [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "8%",
  },
  {
    title: "Tên sách",
    dataIndex: "name",
    key: "name",
    width: "25%",
  },
  {
    title: "Ảnh bìa",
    dataIndex: "image",
    key: "image",
    width: "8%",
    render: (image) =>
      image ? (
        <img src={image} alt="book" style={{ width: "60px", height: "80px", objectFit: "cover" }} />
      ) : (
        "Không có ảnh"
      ),
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
    width: "8%",
    sorter: (a, b) => a.quantity - b.quantity,
    sortDirections: ['ascend', 'descend'],
    defaultSortOrder: null,
  },
  {
    title: "Chi tiết",
    dataIndex: "detail",
    key: "detail",
    width: "8%",
  },
  {
    title: "Hành động",
    dataIndex: "UD",
    key: "UD",
    width: "8%",
  },
];
