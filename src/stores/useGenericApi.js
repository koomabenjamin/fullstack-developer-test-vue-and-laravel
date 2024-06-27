// import axiosInstance from '@/axios'
import axios from "axios";

const token = localStorage.getItem("authToken");

// console.log("TOKEN: ", token)

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export function useGenericApi() {
  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(endpoint, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const postData = async (endpoint, data) => {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  };

  const deleteData = async (endpoint, id) => {
    try {
      const response = await axiosInstance.post(endpoint, { id });
      return response.data;
    } catch (error) {
      console.error(`Error Deleting Data:`, error);
      throw error;
    }
  };

  return { fetchData, postData, deleteData };
}
