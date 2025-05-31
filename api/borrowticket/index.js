import axiosClient from "../axiosClient";

const borrowTicketApi = {
  getAllBorrowTickets: async () => {
    const response = await axiosClient.get("/borrow-tickets");
    return response;
  },
  getBorrowTicketById: async (id) => {
    const response = await axiosClient.get(`/borrow-tickets/${id}`);
    return response;
  },
  createBorrowTicket: async (borrowTicket) => {
    const response = await axiosClient.post("/borrow-tickets", borrowTicket);
    return response;
  },
  updateBorrowTicket: async (id, borrowTicket) => {
    const response = await axiosClient.put(`/borrow-tickets/${id}`, borrowTicket);
    return response;
  },
  deleteBorrowTicket: async (id) => {
    const response = await axiosClient.delete(`/borrow-tickets/${id}`);
    return response;
  },
  getListBookOfTicket: async (id) => {
    const response = await axiosClient.get(`/borrow-tickets/${id}/listbook`);
    return response;
  },
  getBorrowTicketByCardNumber: async (cardNumber) => {
    const response = await axiosClient.get(`/borrow-tickets/cardnumber/${cardNumber}`);
    return response;
  },
};  
export default borrowTicketApi;
