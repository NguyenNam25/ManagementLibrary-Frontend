import { Link } from "react-router-dom";
import { HomeOutlined, SearchOutlined, BookOutlined, ReadOutlined } from "@ant-design/icons";

export const NavMenuItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: <Link to="/reader/home">Home</Link>,
  },
  {
    key: "search",
    icon: <SearchOutlined />,
    label: <Link to="/reader/search">Search</Link>,
  },
  {
    key: "borrow",
    icon: <BookOutlined />,
    label: <Link to="/reader/borrow">Borrow Requests</Link>,
  },
  {
    key: "service",
    icon: <ReadOutlined />,
    label: <Link to="/reader/service">Service</Link>,
  },
];
