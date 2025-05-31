import axiosClient from "../axiosClient";

const roleApi = {
  getAllRoles: async () => {
    const response = await axiosClient.get("/roles");
    return response;
  },
  getRoleById: async (id) => {
    const response = await axiosClient.get(`/roles/${id}`);
    return response;
  },
  
};

export default roleApi;
