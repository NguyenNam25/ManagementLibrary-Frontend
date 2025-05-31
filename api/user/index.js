import axiosClient from "../axiosClient";

const userApi = {
  createUser: async (data) => {
    const response = await axiosClient.post("/users/register", data);
    return response;
  },
  getAllUsers: async () => {
    const response = await axiosClient.get("/users");
    return response;
  },
  getUserById: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response;
  },
  updateUser: async (id, data) => {
    const response = await axiosClient.put(`/users/${id}`, data);
    return response;
  },
  deleteUser: async (id) => {
    const response = await axiosClient.delete(`/users/${id}`);
    return response;
  },
  getUserByEmail: async (email) => {
    const response = await axiosClient.get(`/users/email/${email}`);
    return response;
  },
  getUserByRole: async (role) => {
    const response = await axiosClient.get(`/users/role/${role}`);
    return response;
  },
  getUserByLibraryCard: async (cardNumber) => {
    const response = await axiosClient.get(`/users/libraryCard/${cardNumber}`);
    return response;
  },
  getUserByStatus: async (status) => {
    const response = await axiosClient.get(`/users/status/${status}`);
    return response;
  },
  createLibraryCardForUser: async (id, data) => {
    const response = await axiosClient.post(`/users/libraryCard/${id}`, data);
    return response;
  },
  loginForUser: async (data) => {
    const response = await axiosClient.post("/users/login", data);
    return response;
  },
  logout: async () => {
    const response = await axiosClient.get("/users/logout");
    return response;
  },
  addRule: async (id, data) => {
    const response = await axiosClient.post(`/users/${id}/rules`, data);
    return response;
  },
  deleteRuleById: async (id, ruleId) => {
    const response = await axiosClient.delete(`/users/${id}/rules/${ruleId}`);
    return response;
  },  
  updateRuleById: async (id, ruleId, data) => {
    const response = await axiosClient.put(`/users/${id}/rules/${ruleId}`, data);
    return response;
  },
  addLibInfo: async (id, data) => {
    const response = await axiosClient.post(`/users/${id}/abouts`, data);
    return response;
  },  
  deleteLibInfoById: async (id, libInfoId) => {
    const response = await axiosClient.delete(`/users/${id}/abouts/${libInfoId}`);
    return response;
  },
  updateLibInfoById: async (id, libInfoId, data) => {
    const response = await axiosClient.put(`/users/${id}/abouts/${libInfoId}`, data);
    return response;
  },
  getCurrentUser: async () => {
    const response = await axiosClient.get("/users/current-user");
    return response;
  },
  addService: async (id, data) => {
    const response = await axiosClient.post(`/users/${id}/services`, data);
    return response;
  },
  deleteServiceById: async (id, serviceId) => {
    const response = await axiosClient.delete(`/users/${id}/services/${serviceId}`);
    return response;
  },
  updateServiceById: async (id, serviceId, data) => {
    const response = await axiosClient.put(`/users/${id}/services/${serviceId}`, data);
    return response;
  },
  updateUserInterestedBook: async (id, data) => {
    const response = await axiosClient.post(`/users/${id}/interested-books`, data);
    return response;
  },
  deleteUserInterestedBook: async (id, bookId) => {
    const response = await axiosClient.delete(`/users/${id}/interested-books/${bookId}`);
    return response;
  }
};

export default userApi;
