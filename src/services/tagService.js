import { ref } from "vue";
import axiosInstance from "@/axios";
import { API_URLS } from "@/apis";

export const allTags = ref([]);

export const fetchAllTagsData = async () => {
  try {
    const response = await axiosInstance.get(API_URLS.LIST_ALL_TAGS);
    allTags.value = response.data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const submitTagData = async (dataName, colorName) => {
  try {
    const response = await axiosInstance.post(API_URLS.SAVE_OR_UPDATE_TAG, {
      tag_name: dataName,
      tag_color: colorName,
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
