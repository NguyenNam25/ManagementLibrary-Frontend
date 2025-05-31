import { Route } from "react-router-dom";
import ReaderHome from "../Reader/Home/ReaderHome";
import Searching from "../Reader/Searching/Searching";
import BookDetails from "../Reader/Searching/BookDetails";
import ServiceRule from "../Reader/Libinfo/ServiceRule";
import MyReaderAccount from "../Reader/Info/MyReaderAccount";
import BorrowRequest from "../Reader/Borrow/BorrowRequest";
import Login from "../Reader/Login/Login";
import SignUp from "../Reader/Login/SignUp";

const ReaderRoutes = [
  <Route path="/reader" element={<ReaderHome />} />,
  <Route path="/reader/home" element={<ReaderHome />} />,
  <Route path="/reader/book/:id" element={<BookDetails />} />,
  <Route path="/reader/books/new" element={<ReaderHome />} />, // Replace with BookList when available
  <Route path="/reader/books/popular" element={<ReaderHome />} />, // Replace with BookList when available
  <Route path="/reader/search" element={<Searching />} />, // Updated to use the Searching component
  <Route path="/reader/borrow" element={<BorrowRequest />} />, // Updated to use the BorrowRequest component
  <Route path="/reader/service" element={<ServiceRule />} />, // Replace with Service when available
  <Route path="/reader/libinfo" element={<ReaderHome />} />, // Replace with LibraryInfo when available
  <Route path="/reader/login" element={<Login />} />,
  <Route path="/reader/signup" element={<SignUp />} />,
  <Route path="/reader/account" element={<MyReaderAccount />} />, // Replace with Account when available
];

export default ReaderRoutes;
