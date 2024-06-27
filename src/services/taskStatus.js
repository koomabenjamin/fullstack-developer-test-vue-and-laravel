import { ref } from "vue";
import axiosInstance from "@/axios";
import { API_URLS } from "@/apis";

export const allCurrentUserTaskStatuses = ref([]);

export const fetchAllCurrentUserTaskStatusData = async () => {
  try {
    const response = await axiosInstance.get(
      API_URLS.LIST_ALL_CURRENT_USER_TASK_STATUSES
    );
    allCurrentUserTaskStatuses.value = response.data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const handleError = (error, customMessage) => {
  let errorMessage = customMessage || "An error occurred.";
  if (error.response && error.response.data && error.response.data.message) {
    errorMessage = error.response.data.message;
  } else {
    console.error("Error details:", error);
    errorMessage = error.message || "Network Error";
  }
  alert(errorMessage);
};
