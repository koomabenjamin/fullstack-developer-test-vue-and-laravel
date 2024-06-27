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
        v-for="card in deletedTaskCards.filter(
          (el) => el.status === column.slug
        )"
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
                          @click="showRestoreTask(card)"
                          :class="[
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900',
                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                          ]"
                        >
                          Restore
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
  updateTaskDataStatus,
  fetchAllDeletedTasksData,
  fetchAllTasksData,
  submitTaskData,
  restoreDeletedTaskData,
  allDeletedTasks,
  deletedTaskCards,
  taskPriority,
  taskStatuses,
  handleError,
} from "@/services/taskService";

const enabled = ref(false);
const selectedFormObject = ref({});
const isOpen = ref(false);
const draggedCardID = ref(null);

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

// console.log("ALL DELETED TASKS CARDS FE", deletedTaskCards.value);
const dropdownOpen = ref(false);
const columns = ref([]);
const data = ref(null);

const onDragStart = (cardID) => {
  draggedCardID.value = cardID;
  // console.log("ON DRAG START: ",cardID )
};

async function onDragAndDropEnter(newStatusSlug) {
  const cardIndex = deletedTaskCards.value.findIndex(
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
      await fetchAllDeletedTasksData();
    } catch (error) {
      let errorMessage = "Error while submitting tasks";
      handleError(error, errorMessage);
    }
  }
}

const showRestoreTask = (data) => {
  let dataToRestore = `<p style='font-size: 14px;'>Would you like to Restore <b>${data.task_name}</b> task back to the Kanboard now? <br/></p>`;
  Swal.fire({
    icon: "question",
    html: dataToRestore,
    showDenyButton: true,
    reverseButtons: true,
    confirmButtonText: "Yes, Proceed",
    denyButtonText: `No, Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      submitRestoreTaskForm(data.id);
    } else if (result.isDenied) {
    }
  });
};

const submitRestoreTaskForm = async (taskId) => {
  try {
    const response = await restoreDeletedTaskData(taskId);
    await fetchAllDeletedTasksData();
  } catch (error) {
    handleError(error, "Error Occured. Please try again.");
  }
};

const searchCard = (e) => {
  // console.log(e.target.value)
  let filteredCards = deletedTaskCards.value.filter((card) =>
    card.members.includes(parseInt(e.target.value))
  );
  if (e.target.value) deletedTaskCards.value = filteredCards;
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
  return deletedTaskCards.value.filter((card) => card.status === status);
};

onMounted(async () => {
  try {
    await Promise.all([
      fetchAllCurrentUserTaskStatusData(),
      fetchAllTasksData(),
      fetchAllTagsData(),
      fetchAllMembersData(),
      fetchAllCategoriesData(),
      fetchAllDeletedTasksData(),
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
