import React from "react";

export default [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "8%",
  },
  {
    title: "Tieu de",
    dataIndex: "name",
    key: "name",
    width: "25%",
  },
  {
    title: "Anh",
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
    title: "So luong",
    dataIndex: "quantity",
    key: "quantity",
    width: "8%",
    sorter: (a, b) => a.quantity - b.quantity,
    sortDirections: ['ascend', 'descend'],
    defaultSortOrder: null,
  },
  {
    title: "Chi tiet",
    dataIndex: "detail",
    key: "detail",
    width: "8%",
  },
  {
    title: "",
    dataIndex: "UD",
    key: "UD",
    width: "8%",
  },
];
