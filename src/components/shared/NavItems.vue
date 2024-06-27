<template>
  <div
    v-for="item in props.items"
    :key="item"
    @click="openCloseSublists(item.label)"
    class="w-full h-auto flex-col flex -my-2"
  >
    <div
      class="flex h-12 items-center hover:bg-yellow-100 justify-between p-1 hover:border hover:shadow-md rounded"
    >
      <div class="flex items-center space-x-2 text-sm">
        <component class="h-6 w-6 stroke-2" :is="Icons[item.icon]"></component>
        <span class="font-semibold">{{ item.label }}</span>
      </div>
      <div>
        <component
          class="h-5 w-5 stroke-2"
          :is="Icons['ChevronDownIcon']"
          v-if="item.subList.length > 0 && !subListsOpen.includes(item.label)"
        >
        </component>
        <component
          class="h-5 w-5 stroke-2"
          :is="Icons['ChevronUpIcon']"
          v-if="item.subList.length > 0 && subListsOpen.includes(item.label)"
        >
        </component>
      </div>
    </div>
    <div
      v-if="item.subList.length > 0 && subListsOpen.includes(item.label)"
      class="pl-10 space-y-4"
    >
      <div v-for="item in item.subList" :key="item">
        <div
          :class="{ 'bg-yellow-300': item.name === 'Statra Insurance' }"
          class="flex items-center space-x-2 cursor-pointer p-1 rounded"
        >
          <!-- <span :class="`h-3 w-3 ${item.color} rounded-full`"></span> -->
          <span
            :style="{ backgroundColor: item.color }"
            :class="`h-3 w-3 rounded-full`"
          ></span>
          <span class="text-sm">{{ item.name }}</span>
        </div>
      </div>
      <div
        class="flex items-center space-x-2 cursor-pointer text-sm"
        @click="showForm(item.name)"
      >
        <component
          class="h-5 w-5 stroke-2"
          :is="Icons['PlusCircleIcon']"
          v-if="item.subList.length > 0 && subListsOpen.includes(item.label)"
        >
        </component>
        <span>Add {{ upper(item.name) }}</span>
      </div>
    </div>
  </div>

  <Modal>
    <template v-slot:heading>Add {{ upper(selectedForm) }}</template>
    <template v-slot:form>
      <form
        @submit.prevent="submitTaskForm"
        class="grid grid-cols-1 gap-4"
        v-if="selectedForm === 'task'"
      >
        <div>
          <label for="project" class="block text-sm font-medium text-gray-900">
            Project:
          </label>
          <CustomSelect
            placeholder="Select Project"
            v-model="selectedProject"
            :options="transformedProjects"
          ></CustomSelect>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-900">
            Category:
          </label>
          <CustomSelect
            placeholder="Select Category"
            v-model="selectedCategory"
            :options="transformedCategories"
          ></CustomSelect>
        </div>

        <div>
          <label
            for="task_name"
            class="block text-sm font-medium text-gray-900"
          >
            Task Name:
          </label>
          <Input
            placeholder="Task Name"
            type="text"
            v-model="taskName"
            required
            class="w-full"
          />
        </div>

        <div>
          <label
            for="task_description"
            class="block text-sm font-medium text-gray-900"
          >
            Task Description:
          </label>
          <TextArea
            v-model="taskDescription"
            rows="5"
            placeholder="Description"
            class="w-full"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="task_start_date"
              class="block text-sm font-medium text-gray-900"
            >
              Start Date:
            </label>
            <Input
              required
              v-model="taskStartDate"
              placeholder="Start Date"
              type="date"
              class="w-full"
              :min="todayDate"
            />
          </div>

          <div>
            <label
              for="task_end_date"
              class="block text-sm font-medium text-gray-900"
            >
              End Date:
            </label>
            <Input
              required
              v-model="taskEndDate"
              placeholder="End Date"
              type="date"
              class="w-full"
              :min="minEndDate"
            />
          </div>
        </div>

        <div>
          <label
            for="task_priority"
            class="block text-sm font-medium text-gray-900"
          >
            Priority:
          </label>
          <CustomSelect
            placeholder="Select Task Priority"
            v-model="selectedTaskPriority"
            :options="taskPriority"
          ></CustomSelect>
        </div>

        <div>
          <label
            for="task_status"
            class="block text-sm font-medium text-gray-900"
          >
            Task Status:
          </label>
          <CustomSelect
            placeholder="Select Task Status"
            v-model="selectedTaskStatus"
            :options="transformedTaskStatus"
            required
          ></CustomSelect>
        </div>

        <div>
          <label
            for="task_tags"
            class="block text-sm font-medium text-gray-900"
          >
            Tags:
          </label>
          <CustomSelect
            placeholder="Select Tag"
            v-model="tagIDS"
            :options="transformedTags"
            multiple
          ></CustomSelect>
        </div>

        <div>
          <label
            for="task_members"
            class="block text-sm font-medium text-gray-900"
          >
            Members:
          </label>
          <CustomSelect
            placeholder="Select Member"
            v-model="memberIDS"
            :options="transformedMembers"
            multiple
          ></CustomSelect>
        </div>

        <Button
          label="Add New Task"
          icon="PlusIcon"
          color="bg-lime-500 text-white"
          size="xl"
          class="col-span-1"
        />
      </form>

      <form
        @submit.prevent="submitTagForm"
        class="grid grid-cols-2 gap-2 -space-y-0"
        v-if="selectedForm === 'tag'"
      >
        <label for="tag_name" class="block text-sm font-medium text-gray-900"
          >Tag Name:</label
        >
        <Input
          placeholder="Tag Name"
          v-model="dataName"
          required
          class="col-span-2"
        />
        <div>
          <h6 class="mt-3">Pick Tag Color</h6>
          <ColorPicker @color-changed="getUpdatedColor($event)"></ColorPicker>
        </div>
        <Button
          label="Add New Tag"
          type="submit"
          icon="PlusIcon"
          color="bg-lime-500 text-white col-span-2"
          size="xl"
        />
      </form>

      <form
        @submit.prevent="submitMemberForm"
        class="grid grid-cols-1 gap-4"
        v-if="selectedForm === 'member'"
      >
        <div>
          <label for="name" class="block text-sm font-medium text-gray-900"
            >Name:</label
          >
          <input
            id="name"
            name="name"
            type="text"
            v-model="name"
            placeholder="Name"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-900"
            >Email Address:</label
          >
          <input
            id="email"
            name="email"
            type="email"
            v-model="email"
            placeholder="E-mail Address"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
          />
        </div>

        <div class="col-span-1">
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
          >
            <PlusIcon class="h-5 w-5 text-white mr-2" aria-hidden="true" /> Add
            New Member
          </button>
        </div>
      </form>

      <form
        class="grid grid-cols-2 gap-2 -space-y-0"
        v-if="selectedForm === 'status'"
      >
        <Input placeholder="Title" class="col-span-2" />
        <Input placeholder="Start Date" type="date" />
        <Input placeholder="End Date" type="date" />
        <Input placeholder="Priority" class="col-span-2" />
        <TextArea rows="5" placeholder="Description" class="col-span-2" />
        <TextArea rows="5" placeholder="Members" class="col-span-2" />
        <Button
          label="Add new task"
          icon="PlusIcon"
          color="bg-lime-500 text-white col-span-2"
          size="xl"
        />
      </form>

      <form
        @submit.prevent="submitProjectForm"
        class="grid grid-cols-2 gap-2 -space-y-0"
        v-if="selectedForm === 'project'"
      >
        <!-- <Input placeholder="Project Name" v-model="dataName" required class="col-span-2"/> -->

        <label
          for="project_name"
          class="block text-sm font-medium text-gray-900"
          >Project Name:</label
        >
        <Input
          placeholder="Project Name"
          v-model="dataName"
          required
          class="col-span-2"
        />

        <div>
          <h6 class="mt-3">Pick Project Color</h6>
          <ColorPicker @color-changed="getUpdatedColor($event)"></ColorPicker>
        </div>
        <Button
          type="submit"
          label="Add new task"
          icon="PlusIcon"
          color="bg-lime-500 text-white col-span-2"
          size="xl"
        />
      </form>

      <form
        @submit.prevent="submitCategoryForm"
        class="grid grid-cols-2 gap-2 -space-y-0"
        v-if="selectedForm === 'category'"
      >
        <label
          for="category_name"
          class="block text-sm font-medium text-gray-900"
          >Category Name:</label
        >
        <Input
          placeholder="Category Name"
          v-model="dataName"
          required
          class="col-span-2"
        />

        <div>
          <h6 class="mt-3">Pick Category Color</h6>
          <ColorPicker @color-changed="getUpdatedColor($event)"></ColorPicker>
        </div>
        <Button
          type="submit"
          label="Add New Category"
          icon="PlusIcon"
          color="bg-lime-500 text-white col-span-2"
          size="xl"
        />
      </form>
    </template>
  </Modal>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed, watch } from "vue";
import * as Icons from "@heroicons/vue/24/outline";
import Modal from "./ModalUpdate.vue";
import Input from "./Input.vue";
import Button from "./Button.vue";
import CustomSelect from "./CustomSelect.vue";
import TextArea from "./TextArea.vue";
import ColorPicker from "./ColorPicker.vue";
import { useRouter } from "vue-router";
import {
  fetchAllProjectsData,
  submitProjectData,
  allProjects,
  handleError,
} from "@/services/projectService";
import {
  fetchAllTagsData,
  submitTagData,
  allTags,
} from "@/services/tagService";
import {
  fetchAllMembersData,
  submitMemberData,
  allMembers,
} from "@/services/memberService";

import {
  fetchAllCategoriesData,
  submitCategoryData,
  allCategories,
} from "@/services/categoryService";

import {
  fetchAllCurrentUserTaskStatusData,
  allCurrentUserTaskStatuses,
} from "@/services/taskStatus";

import {
  fetchAllTasksData,
  submitTaskData,
  allTasks,
  taskPriority,
} from "@/services/taskService";

import { PlusIcon } from "@heroicons/vue/24/outline";

import { useNavItemsStore } from "@/stores/navItems";

import { API_URLS } from "@/apis";
import axiosInstance from "@/axios";
const router = useRouter();

const navItemsStore = useNavItemsStore();
const navItems = navItemsStore.navItems;

const updateProjectsInNavItems = () => {
  navItemsStore.updateProjectsInNavItems(allProjects.value);
};

const updateTagsInNavItems = () => {
  navItemsStore.updateTagsInNavItems(allTags.value);
};

const updateMembersInNavItems = () => {
  navItemsStore.updateMembersInNavItems(allMembers.value);
};

const updateTaskListsInNavItems = () => {
  navItemsStore.updateTaskListsInNavItems(allTasks.value);
};

const updateCategoryListsInNavItems = () => {
  navItemsStore.updateCategoryListsInNavItems(allCategories.value);
};

const transformedMembers = ref([]);
const transformedTaskStatus = ref([]);
const transformedProjects = ref([]);
const transformedCategories = ref([]);
const transformedTags = ref([]);

const props = defineProps({
  name: [String, Number],
  label: [String, Number],
  icon: [String, Number],
  subList: [Array, Object],
  items: [Array, Object],
});

const selectedTaskPriority = ref(taskPriority[0]);
const selectedProject = ref(transformedProjects.value[0]);
const selectedCategory = ref(transformedCategories.value[0]);
const selectedTaskStatus = ref(transformedTaskStatus.value[0]);

const subListsOpen = ref([]);
const dataName = ref("");
const colorName = ref("");
const name = ref("");
const email = ref("");
const task_id = ref(null);

const taskName = ref("");
const taskDescription = ref("");
const taskStartDate = ref("");
const taskEndDate = ref("");
const tagIDS = ref([]);
const memberIDS = ref([]);

const isOpen = ref(false);

const selectedForm = ref("tag");

provide("isOpenSideModal", isOpen);

const openCloseSublists = (subList) => {
  if (!subListsOpen.value.includes(subList)) subListsOpen.value.push(subList);
  else {
    let indexOfList = subListsOpen.value.indexOf(subList);
    if (indexOfList !== -1) subListsOpen.value.splice(indexOfList, 1);
  }
};

const getUpdatedColor = (e) => {
  colorName.value = e;
};

const submitProjectForm = async () => {
  try {
    const response = await submitProjectData(dataName.value, colorName.value);
    // console.log("RESPONSE: ", response);
    await fetchAllProjectsData();
    updateProjectsInNavItems();
    clearState();
    isOpen.value = false;
  } catch (error) {
    handleError(error, "Error Occured. Please try again.");
  }
};

const submitCategoryForm = async () => {
  try {
    const response = await submitCategoryData(dataName.value, colorName.value);
    await fetchAllCategoriesData();
    updateCategoryListsInNavItems();
    clearState();
    isOpen.value = false;
  } catch (error) {
    handleError(error, "Error Occured. Please try again.");
  }
};

const submitTaskForm = async () => {
  let tagData = [];
  let memberData = [];

  let taskFoundTaskPriority = taskPriority.find(
    (priority) => priority.value === selectedTaskPriority.value
  );

  if (tagIDS.value.length > 0) {
    const uniqueTagIDs = new Set(tagIDS.value);
    uniqueTagIDs.forEach((objectId) => {
      const tag = allTags.value.find((t) => t.id === objectId);
      if (tag) {
        let dataToPush = {
          id: tag.id,
          tag_name: tag.tag_name,
          tag_color: tag.tag_color,
        };
        tagData.push(dataToPush);
      }
    });
  }

  if (memberIDS.value.length > 0) {
    const uniqueMemberIDs = new Set(memberIDS.value);
    uniqueMemberIDs.forEach((objectId) => {
      const member = allMembers.value.find((t) => t.id === objectId);
      if (member) {
        let dataToPush = {
          id: member.id,
          name: member.name,
        };
        memberData.push(dataToPush);
      }
    });
  }

  if (selectedTaskStatus.value == null || selectedTaskStatus.value == "") {
    alert("Please Select the status");
    return;
  }

  if (selectedProject.value == null || selectedProject.value == "") {
    alert("Please Select the project");
    return;
  }

  const dataToBackend = {
    task_id: task_id.value,
    project_id: selectedProject.value,
    category_id: selectedCategory.value,
    status_id: selectedTaskStatus.value,
    task_name: taskName.value,
    start_date: taskStartDate.value,
    end_date: taskEndDate.value,
    task_priority: taskFoundTaskPriority.label.toLowerCase(),
    description: taskDescription.value ? taskDescription.value : "",
    tags: tagData ? tagData : [],
    members: memberData ? memberData : [],
  };
  try {
    const response = await submitTaskData(dataToBackend);
    await fetchAllTasksData();
    updateTaskListsInNavItems();
    clearState();
    isOpen.value = false;
  } catch (error) {
    handleError(error, "Error Occured. Please try again.");
  }
};

const submitTagForm = async () => {
  try {
    const response = await submitTagData(dataName.value, colorName.value);
    await fetchAllTagsData();
    updateTagsInNavItems();
    clearState();
    isOpen.value = false;
  } catch (error) {
    handleError(error, "Error Occured. Please try again.");
  }
};

const submitMemberForm = async () => {
  try {
    const response = await submitMemberData(name.value, email.value);
    await fetchAllMembersData();
    updateMembersInNavItems();
    clearState();
    isOpen.value = false;
  } catch (error) {
    handleError(error, "Error Occured. Please try again.");
  }
};

const goToDashbaord = () => {
  router.push("/");
};

const upper = (str) => {
  str = str.toLowerCase().split(" ");

  let final = [];

  for (let word of str) {
    final.push(word.charAt(0).toUpperCase() + word.slice(1));
  }

  return final.join(" ");
};

const showForm = (form) => {
  isOpen.value = true;
  selectedForm.value = form;
};

const todayDate = computed(() => {
  return new Date().toISOString().split("T")[0];
});

const minEndDate = computed(() => {
  //=====Don't allow a user to select past end dateie past the start date===
  const startDate = new Date(taskStartDate.value);
  if (!isNaN(startDate.getTime())) {
    return startDate.toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
});

const clearState = () => {
  dataName.value = "";
  colorName.value = "";
  name.value = "";
  email.value = "";
  task_id.value = null;
  taskName.value = "";
  taskDescription.value = "";
  taskStartDate.value = "";
  taskEndDate.value = "";
  tagIDS.value = [];
  memberIDS.value = [];
  selectedTaskPriority.value = taskPriority[0];
  selectedProject.value = transformedProjects.value[0];
  selectedCategory.value = transformedCategories.value[0];
  selectedTaskStatus.value = transformedTaskStatus.value[0];
};

onMounted(async () => {
  try {
    // Fetch all data
    await Promise.all([
      fetchAllMembersData(),
      fetchAllTagsData(),
      fetchAllCategoriesData(),
      fetchAllCurrentUserTaskStatusData(),
      fetchAllProjectsData(),
      fetchAllTasksData(),
    ]);

    // =====Transform fetched data for use in components===
    transformedMembers.value = allMembers.value.map((object) => ({
      label: object.name,
      value: object.id,
    }));

    transformedTaskStatus.value = allCurrentUserTaskStatuses.value.map(
      (object) => ({
        label: object.title,
        value: object.id,
      })
    );

    transformedProjects.value = allProjects.value.map((object) => ({
      label: object.project_name,
      value: object.id,
    }));

    transformedTags.value = allTags.value.map((object) => ({
      label: object.tag_name,
      value: object.id,
    }));

    transformedCategories.value = allCategories.value.map((object) => ({
      label: object.category_name,
      value: object.id,
    }));
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
});
</script>

<style></style>
