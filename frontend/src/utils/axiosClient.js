import axios from "axios";
import { store } from "../redux/store"; // import store

const axiosClient = axios.create({
  baseURL: "http://localhost:9999",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ redux store
    const token = store.getState().account?.account?.data;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("Response status:", response.status, "Data:", response.data);
    return response.data;
  },
  (error) => {
    console.error("Response error:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
