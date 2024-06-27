<template>
  <div class="w-full h-20 border-b flex items-center justify-between px-4">
    <div class="flex space-x-4 items-center">
      <MagnifyingGlassIcon class="w-5 h-5" />
      <!-- <input placeholder="Search for something" class="h-full bg-lime-50 h-12" @keyup="searchCard($event)"> -->
      <Input placeholder="Search for something" />
    </div>
    <div class="flex items-center space-x-2">
      <!-- switch -->
      <div class="flex items-center space-x-2 relative text-sm">
        <Switch
          v-model="enabled"
          :class="enabled ? 'bg-lime-400' : 'bg-black'"
          class="relative inline-flex h-[30px] w-[55px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <span class="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            :class="enabled ? 'translate-x-[25px]' : 'translate-x-0'"
            class="pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
          />
        </Switch>
        <span>Select Timeframe</span>
        <ChevronUpIcon class="w-4" />
        <!-- Calendar -->
        <Calendar v-if="enabled" />
      </div>

      <Button
        label="Share"
        icon="ShareIcon"
        color="bg-transparent"
        size="md"
        drop-down
      />
    </div>
  </div>

  <div class="w-full h-full flex overflow-auto">
    <div
      class="w-1/3 border-r flex-shrink-0 text-xs overflow-auto"
      v-for="column in columns"
      :key="column.slug"
      @dragover.prevent
      @drop="onDragAndDropEnter(column)"
    >
      <h5 class="pl-4 text-lg py-2">{{ column.title }}</h5>
      <div
        class="m-2 p-5 bg-white rounded-lg h-auto border shadow"
        v-for="card in cards.filter((el) => el.status === column.slug)"
        :key="card.id"
        :id="card.id"
        draggable="true"
        @dragstart="onDragStart(card.id)"
      >
        <div class="flex items-center justify-between">
          <div
            class="flex -space-x-4"
            v-if="card.members != null && card.members.length > 0"
          >
            <div
              class="h-10 w-10 rounded-full border-2 border-slate-500 bg-black"
              v-for="member in card.members"
              :key="member"
            ></div>
          </div>
          <div class="flex -space-x-4" v-else>
            <h6 class="text-rose-400">No Member Added Yet</h6>
          </div>
          <div class="relative flex items-center">
            <div
              class="w-auto px-2 bg-rose-200 text-rose-600 py-1 rounded-full font-bold capitalize"
            >
              {{ toTitleCase(card.priority) }}
            </div>
            <div class="ml-2 relative">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton>
                    <ChevronDownIcon
                      class="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                      aria-hidden="true"
                    />
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <MenuItems
                    class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                  >
                    <div class="px-1 py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="editTask(card)"
                          :class="[
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900',
                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                          ]"
                        >
                          Edit
                        </button>
                      </MenuItem>
                    </div>

                    <div class="px-1 py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="showDeleteTask(card)"
                          :class="[
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900',
                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                          ]"
                        >
                          Delete
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>

        <div class="font-bold text-sm my-3">{{ card.task_name }}</div>

        <div class="flex flex-wrap items-center space-x-1 my-1 text-[10px]">
          <div
            v-for="tag in card.tags"
            :key="tag.id"
            class="w-auto px-2 bg-blue-200 py-0.5 rounded-full font-bold capitalize"
            :style="{ backgroundColor: tag.tag_color }"
          >
            {{ toTitleCase(tag.tag_name) }}
          </div>
        </div>
        <div
          class="flex items-center space-x-2 text-slate-500 font-semibold mt-4 text-[10px]"
        >
          <CalendarIcon class="h-5 stroke-2" />
          <span>{{ card.date }}</span>
        </div>
      </div>
    </div>
  </div>

  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-500"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-500"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="div"
                class="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
              >
                <h4>
                  Update
                  <span class="font-bold">{{
                    selectedFormObject.task_name
                  }}</span
                  >Task
                </h4>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border shadow-md bg-lime-100 px-2 py-2 text-sm font-medium text-lime-900 hover:bg-lime-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  <XMarkIcon class="h-6" />
                </button>
              </DialogTitle>

              <form
                @submit.prevent="submitTaskForm"
                class="grid grid-cols-1 gap-4"
              >
                <div>
                  <label
                    for="project"
                    class="block text-sm font-medium text-gray-900"
                  >
                    Project:
                  </label>
                  <CustomSelect
                    placeholder="Select Project"
                    v-model="selectedProject"
                    :options="transformedProjects"
                  ></CustomSelect>
                </div>

                <div>
                  <label
                    for="category"
                    class="block text-sm font-medium text-gray-900"
                  >
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
                  label="Update Task"
                  icon="PlusIcon"
                  color="bg-lime-500 text-white"
                  size="xl"
                  class="col-span-1"
                />
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, reactive, onMounted, inject, computed } from "vue";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Switch,
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

import { XMarkIcon } from "@heroicons/vue/24/outline";

import Modal from "./../shared/ModalUpdate.vue";
import {
  ArrowsPointingInIcon,
  ChartBarIcon,
  Square3Stack3DIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  WalletIcon,
  CalendarIcon,
} from "@heroicons/vue/24/outline";
import Swal from "sweetalert2/dist/sweetalert2";

import Button from "../shared/Button.vue";
import Input from "../shared/Input.vue";
import CustomSelect from "../shared/CustomSelect.vue";
import TextArea from "../shared/TextArea.vue";
import ColorPicker from "../shared/ColorPicker.vue";

import Fab from "../shared/Fab.vue";
import Tag from "../shared/Tag.vue";
import Card from "../shared/Card.vue";
import Calendar from "../shared/Calendar.vue";
import axiosInstance from "@/axios";

import { fetchAllProjectsData, allProjects } from "@/services/projectService";
import {
  fetchAllCategoriesData,
  allCategories,
} from "@/services/categoryService";
import { fetchAllTagsData, allTags } from "@/services/tagService";
import { fetchAllMembersData, allMembers } from "@/services/memberService";

import {
  fetchAllCurrentUserTaskStatusData,
  allCurrentUserTaskStatuses,
} from "@/services/taskStatus";

import {
  fetchAllTasksData,
  submitTaskData,
  updateTaskDataStatus,
  deleteTaskData,
  allTasks,
  cards,
  taskPriority,
  taskStatuses,
  handleError,
} from "@/services/taskService";

const draggedCardID = ref(null);
const enabled = ref(false);
const selectedFormObject = ref({});
const isOpen = ref(false);

const transformedMembers = ref([]);
const transformedTaskStatus = ref([]);
const transformedProjects = ref([]);
const transformedCategories = ref([]);
const transformedTags = ref([]);

const selectedTaskPriority = ref(0);
const selectedProject = ref(0);
const selectedTaskStatus = ref(0);
const selectedCategory = ref(0);

const taskName = ref("");
const taskDescription = ref("");
const taskStartDate = ref("");
const taskEndDate = ref("");
const taskTags = ref([]);
const taskMembers = ref([]);
const tagIDS = ref([]);
const memberIDS = ref([]);

function closeModal() {
  isOpen.value = false;
}

// console.log("ALL TASKS CARDS FE", cards.value);

const dropdownOpen = ref(false);
const columns = ref([]);
const data = ref(null);

const onDragStart = (cardID) => {
  draggedCardID.value = cardID;
  // console.log("ON DRAG START: ",cardID )
};

async function onDragAndDropEnter(newStatusSlug) {
  const cardIndex = cards.value.findIndex(
    (card) => card.id === draggedCardID.value
  );
  // console.log("NEW ID: ", newStatusSlug.id)
  // console.log("NEW STATUS: ", newStatusSlug.slug)
  if (cardIndex !== -1) {
    const dataToBackend = {
      task_id: draggedCardID.value,
      status_id: newStatusSlug.id,
    };
    try {
      const response = await updateTaskDataStatus(dataToBackend);
      await fetchAllTasksData();
    } catch (error) {
      handleError(error, "Error while submitting tasks");
    }
  }
}

const submitTaskForm = async (data) => {
  let tagData = [];
  let memberData = [];

  let taskFoundTaskPriority = taskPriority.find(
    (priority) => priority.value === selectedTaskPriority.value
  );

  // let taskFoundTaskStatus = taskStatuses.find(status => status.value === selectedTaskPriority.value);

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
    task_id: selectedFormObject.value.id,
    project_id: selectedProject.value,
    category_id: selectedCategory.value,
    status_id: selectedTaskStatus.value,
    task_name: taskName.value,
    task_color: null,
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
    isOpen.value = false;
  } catch (error) {
    handleError(error, "Error while submitting tasks");
  }
};

const showDeleteTask = (data) => {
  let dataToDelete = `<p style='font-size: 14px;'>Would you like to Delete <b>${data.task_name}</b> task? <br/>Once Deleted, you can visit the "Task Repository" to restore.<br/></p>`;
  Swal.fire({
    icon: "question",
    html: dataToDelete,
    showDenyButton: true,
    reverseButtons: true,
    confirmButtonText: "Yes, Proceed",
    denyButtonText: `No, Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      submitDeleteTaskForm(data.id);
    } else if (result.isDenied) {
    }
  });
};

const submitDeleteTaskForm = async (taskId) => {
  try {
    const response = await deleteTaskData(taskId);
    await fetchAllTasksData();
  } catch (error) {
    handleError(error, "Error Occured. Please try again.");
  }
};

const searchCard = (e) => {
  // console.log(e.target.value)
  let filteredCards = cards.value.filter((card) =>
    card.members.includes(parseInt(e.target.value))
  );
  if (e.target.value) cards.value = filteredCards;
};

const editTask = (taskObject) => {
  let memberIDSArray = [];
  let tagIDSArray = [];
  selectedFormObject.value = taskObject;
  taskName.value = selectedFormObject.value.task_name;
  taskDescription.value = selectedFormObject.value.description;
  taskStartDate.value = selectedFormObject.value.start_date;
  taskEndDate.value = selectedFormObject.value.end_date;

  if (
    selectedFormObject.value.tags != null &&
    selectedFormObject.value.tags != undefined
  ) {
    selectedFormObject.value.tags.map((object) => {
      tagIDSArray.push(object.id);
    });
    tagIDS.value = tagIDSArray;
  }

  if (
    selectedFormObject.value.members != null &&
    selectedFormObject.value.members != undefined
  ) {
    selectedFormObject.value.members.map((object) => {
      memberIDSArray.push(object);
    });
    memberIDS.value = memberIDSArray;
  }

  const project = transformedProjects.value.find(
    (t) => t.value === selectedFormObject.value.project_id
  );
  if (project != null && project != undefined) {
    selectedProject.value = project.value;
  }

  const category = transformedCategories.value.find(
    (t) => t.value === selectedFormObject.value.category_id
  );
  // console.log("ALL CATS: ", transformedCategories)
  //  console.log("CATEGORY: ", category)
  if (category != null && category != undefined) {
    selectedCategory.value = category.value;
  }

  const taskStatusObject = taskStatuses.find(
    (t) =>
      t.label.toLowerCase() ===
      selectedFormObject.value.unformatted_status.title.toLowerCase()
  );
  if (taskStatusObject != null && taskStatusObject != undefined) {
    selectedTaskStatus.value = taskStatusObject.value;
  }

  const taskPriorityObj = taskPriority.find(
    (t) =>
      t.label.toLowerCase() === selectedFormObject.value.priority.toLowerCase()
  );
  if (taskPriorityObj != null && taskPriorityObj != undefined) {
    selectedTaskPriority.value = taskPriorityObj.value;
  }

  isOpen.value = true;
};

const transformedData = () => {
  transformedTaskStatus.value = allCurrentUserTaskStatuses.value.map(
    (object) => {
      return {
        label: object.title,
        value: object.id,
      };
    }
  );

  transformedMembers.value = allMembers.value.map((object) => {
    return {
      label: object.name,
      value: object.id,
    };
  });

  transformedProjects.value = allProjects.value.map((object) => {
    return {
      label: object.project_name,
      value: object.id,
    };
  });

  transformedCategories.value = allCategories.value.map((object) => {
    return {
      label: object.category_name,
      value: object.id,
    };
  });

  transformedTags.value = allTags.value.map((object) => {
    return {
      label: object.tag_name,
      value: object.id,
    };
  });
};

const changeStatus = (id) => {
  setTimeout(() => {
    document.getElementById(id).style.display = "none";
  }, 0);
};

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const filteredCards = (status) => {
  return cards.value.filter((card) => card.status === status);
};

const minEndDate = computed(() => {
  //=====Don't allow a user to select past end dateie past the start date===
  const startDate = new Date(taskStartDate.value);
  if (!isNaN(startDate.getTime())) {
    return startDate.toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
});

const todayDate = computed(() => {
  return new Date().toISOString().split("T")[0];
});

onMounted(async () => {
  try {
    await Promise.all([
      fetchAllCurrentUserTaskStatusData(),
      fetchAllTasksData(),
      fetchAllTagsData(),
      fetchAllMembersData(),
      fetchAllCategoriesData(),
    ]);
    transformedData();
    columns.value = allCurrentUserTaskStatuses.value.map((object) => ({
      id: object.id,
      title: object.title,
      slug: object.slug,
    }));
  } catch (error) {
    handleError(error, "Error fetching initial data.");
  }
});
</script>

<style scoped></style>
