import axiosClient from "../axiosClient";

const majorApi = {
  getAllCategories: async () => {
    try {
      const response = await axiosClient.get("/majors/categories");
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  getAllTypes: async () => {
    try {
      const response = await axiosClient.get("/majors/types");
      return response;
    } catch (error) {
      console.error("Error fetching types:", error);
      throw error;
    }
  },
  getCategoryById: async (id) => {
    try {
      const response = await axiosClient.get(`/majors/category/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }
  },
  getTypeById: async (id) => {
    try {
      const response = await axiosClient.get(`/majors/type/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching type with id ${id}:`, error);
      throw error;
    }
  },
  createCategory: async (data) => {
    try {
      const response = await axiosClient.post("/majors/category", data);
      return response;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },
  deleteCategory: async (id) => {
    try {
      const response = await axiosClient.delete(`/majors/category/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  },
  createType: async (data) => {
    try {
      const response = await axiosClient.post("/majors/type", data);
      return response;
    } catch (error) {
      console.error("Error creating type:", error);
      throw error;
    }
  },
  deleteType: async (id) => {
    try {
      const response = await axiosClient.delete(`/majors/type/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting type with id ${id}:`, error);
      throw error;
    }
  },
  getPopularCategories: async () => {
    try {
      const response = await axiosClient.get("/majors/popular-categories");
      return response;
    } catch (error) {
      console.error("Error fetching popular categories:", error);
      throw error;
    }
  }
};

export default majorApi;
