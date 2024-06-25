

const BASE_URL = import.meta.env.VITE_API_URL;
console.log("BASE URL: ", BASE_URL);

export const API_URLS = {

  //Auth
  REGISTER: `${BASE_URL}/api/auth/v1/register`,
  LOGIN: `${BASE_URL}/api/auth/v1/login`,

  //Tag
  LIST_ALL_TAGS: `${BASE_URL}/api/tag/v1/list-all-tags`,
  SAVE_OR_UPDATE_TAG: `${BASE_URL}/api/tag/v1/create-or-update-tag`,
  DELETE_TAG: `${BASE_URL}/api/tag/v1/delete-tag`,

  //Project
  LIST_ALL_PROJECTS: `${BASE_URL}/api/project/v1/list-all-projects`,
  SAVE_OR_UPDATE_PROJECT: `${BASE_URL}/api/project/v1/create-or-update-project`,
  DELETE_PROJECT: `${BASE_URL}/api/project/v1/delete-project`,

  //Tasks
  LIST_ALL_TASKS: `${BASE_URL}/api/task/v1/list-all-tasks`,
  SAVE_OR_UPDATE_TASk: `${BASE_URL}/api/task/v1/create-or-update-task`,
  DELETE_TASK: `${BASE_URL}/api/task/v1/delete-task`,

   //Members
  LIST_ALL_MEMBERS: `${BASE_URL}/api/member/v1/list-all-members`,
  SAVE_OR_UPDATE_MEMBER: `${BASE_URL}/api/member/v1/create-or-update-member`,
  DELETE_MEMBER: `${BASE_URL}/api/member/v1/delete-member`,


   //Current user Task Status
  LIST_ALL_CURRENT_USER_TASK_STATUSES: `${BASE_URL}/api/status/v1/list-current-user-task-status`,


   
};



