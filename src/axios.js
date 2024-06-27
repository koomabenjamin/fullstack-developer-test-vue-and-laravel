import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // Timeout set to 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to include token from local storage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    // console.log("TOKEN: ", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
