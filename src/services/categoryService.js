import { ref } from "vue";
import axiosInstance from "@/axios";
import { API_URLS } from "@/apis";

export const allCategories = ref([]);

export const fetchAllCategoriesData = async () => {
  try {
    const response = await axiosInstance.get(API_URLS.LIST_ALL_CATEGORIES);
    allCategories.value = response.data.results;
    // console.log("ALL CAT BACKEND: ", allCategories.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const submitCategoryData = async (dataName, colorName) => {
  try {
    const response = await axiosInstance.post(
      API_URLS.SAVE_OR_UPDATE_CATEGORY,
      {
        category_name: dataName,
        category_color: colorName,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting category data:", error);
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
