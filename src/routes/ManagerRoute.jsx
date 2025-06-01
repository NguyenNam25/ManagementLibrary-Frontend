import Login from "../Login/Login";
import Home from "../Home/Home";
import BookList from "../BookManager/BookList";
import AddBook from "../BookManager/AddBook";
import UpdateBook from "../BookManager/UpdateBook";
import UpdateMember from "../MemberManager/UpdateMember";
import Rules from "../ServicesNRules/Rules";
import BTList from "../CheckOut/BTList";
import { Route } from "react-router-dom";
import ForgotPassword from "../Login/ForgotPassword";
import Register from "../Login/Register";
import AccountCreate from "../MemberManager/AccountCreate";
import UserUpdate from "../MemberManager/UserUpdate";
import WaitingBorrowList from "../CheckOut/WaitingList";
import MyAccount from "../User/MyAccount";
import WaitingMember from "../MemberManager/WaitingMember";
import LibraryInformation from "../ServicesNRules/LibraryInformation";
import ReaderList from "../MemberManager/ReaderList";
import ManagerList from "../MemberManager/ManagerList";
import MajorManage from "../BookManager/MajorManage";
const ManagerRoute = [
  <Route path="/" element={<Login />} />,
  <Route path="/home" element={<Home />} />,
  <Route path="/book-list" element={<BookList />} />,
  <Route path="/book-list/add" element={<AddBook />} />,
  <Route path="/book-list/:id/update" element={<UpdateBook />} />,
  <Route path="/manager-list" element={<ManagerList />} />,
  <Route path="/waiting-member" element={<WaitingMember />} />,
  <Route path="/manager/:id/update" element={<UpdateMember />} />,
  <Route path="/rules" element={<Rules />} />,
  <Route path="/library-info" element={<LibraryInformation />} />,
  <Route path="/borrow-ticket" element={<BTList />} />,
  <Route path="/forgot-password" element={<ForgotPassword />} />,
  <Route path="/register" element={<Register />} />,
  <Route path="/manager/account-create" element={<AccountCreate />} />,
  <Route path="/member/:id/update" element={<UserUpdate />} />,
  <Route path="/waiting-borrow-list" element={<WaitingBorrowList />} />,
  <Route path="/account" element={<MyAccount />} />,
  <Route path="/reader-list" element={<ReaderList />} />,
  <Route path="/major-manage" element={<MajorManage />} />,
];

export default ManagerRoute;
