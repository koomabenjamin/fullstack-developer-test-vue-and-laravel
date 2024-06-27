import { ref } from "vue";
import axiosInstance from "@/axios";
import { API_URLS } from "@/apis";

export const allProjects = ref([]);

export const fetchAllProjectsData = async () => {
  try {
    const response = await axiosInstance.get(API_URLS.LIST_ALL_PROJECTS);
    // console.log("ALL PROJECTS RESPONSE: ", response.data.results);
    allProjects.value = response.data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const submitProjectData = async (dataName, colorName) => {
  try {
    const response = await axiosInstance.post(API_URLS.SAVE_OR_UPDATE_PROJECT, {
      project_name: dataName,
      project_color: colorName,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting project data:", error);
    throw error;
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
