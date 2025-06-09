import axios from "axios";

const instance = axios.create({
  baseURL: "https://managementlibrary-backend.onrender.com",
  // baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const axiosClient = {
  get: (url, params = {}) => instance.get(url, { params }),
  post: (url, data, params = {}) => instance.post(url, data, { params }),
  postFormData: (url, data) => {
    const formInstance = axios.create({
      baseURL: "https://managementlibrary-backend.onrender.com",
      // baseURL: "http://localhost:3000",
      withCredentials: true,
      // Không set Content-Type, để browser tự động set với boundary
    });
    
    // Add interceptor cho form instance
    formInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );
    
    return formInstance.post(url, data);
  },
  put: (url, data, params = {}) => instance.put(url, data, { params }),
  putFormData: (url, data) => {
    const formInstance = axios.create({
      baseURL: "https://managementlibrary-backend.onrender.com",
      // baseURL: "http://localhost:3000",
      withCredentials: true,
    });

    formInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );

    return formInstance.put(url, data);
  },  
  delete: (url, params = {}) => instance.delete(url, { params }),
};

export default axiosClient;
