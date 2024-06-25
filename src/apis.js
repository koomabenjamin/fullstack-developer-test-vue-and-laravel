

const BASE_URL = import.meta.env.VITE_API_URL;
console.log("BASE URL: ", BASE_URL);

export const API_URLS = {

  //Auth
  REGISTER: `${BASE_URL}/api/auth/register`,
  LOGIN: `${BASE_URL}/api/auth/login`,

  //Tag
  LIST_ALL_TAGS: `${BASE_URL}/api/tag/list-all-tags`,
  SAVE_OR_UPDATE_TAG: `${BASE_URL}/api/tag/create-or-update-tag`,
  DELETE_TAG: `${BASE_URL}/api/tag/delete-tag`,

  //Project
  LIST_ALL_PROJECTS: `${BASE_URL}/api/project/list-all-projects`,
  SAVE_OR_UPDATE_PROJECT: `${BASE_URL}/api/project/create-or-update-project`,
  DELETE_PROJECT: `${BASE_URL}/api/project/delete-project`,

  //Tasks
  LIST_ALL_TASKS: `${BASE_URL}/api/task/list-all-tasks`,
  SAVE_OR_UPDATE_TASk: `${BASE_URL}/api/task/create-or-update-task`,
  DELETE_TASK: `${BASE_URL}/api/task/delete-task`,

   //Members
   LIST_ALL_MEMBERS: `${BASE_URL}/api/member/list-all-members`,
   SAVE_OR_UPDATE_MEMBER: `${BASE_URL}/api/member/create-or-update-member`,
   DELETE_MEMBBER: `${BASE_URL}/api/member/delete-member`,


   //Current user Task Status
   LIST_ALL_CURRENT_USER_TASK_STATUSES: `${BASE_URL}/api/status/list-current-user-task-status`,


   
};


