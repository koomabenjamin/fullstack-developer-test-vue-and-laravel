<template>
  <div class="h-screen w-screen bg-lime-50 flex">
    <SideBar />
    <div class="w-3/4 flex flex-col">
      <div class="w-full h-auto border-b">
        <div class="w-full h-24 flex items-center justify-between px-4">
          <div class="text-2xl font-bold">Statra Insurance</div>
          <div class="flex space-x-2 items-center">
            <div class="flex -space-x-4">
              <div
                class="h-10 w-10 rounded-full border-2 border-slate-500 bg-black"
              ></div>
              <div
                class="h-10 w-10 rounded-full border-2 border-slate-500 bg-black"
              ></div>
              <div
                class="h-10 w-10 rounded-full border-2 border-slate-500 bg-black"
              ></div>
              <div
                class="h-10 w-10 rounded-full border-2 border-slate-500 bg-black text-white center font-bold"
              >
                +8
              </div>
            </div>
            <Button
              label="Apps"
              icon="Squares2X2Icon"
              color="bg-white"
              size="lg"
              drop-down
            />
            <Button
              label="Add new task"
              icon="PlusIcon"
              color="bg-black"
              text-color="text-white"
              size="lg"
            />
            <Button
              icon="PowerIcon"
              @click.prevent="showLogout"
              color="bg-black"
              text-color="text-white"
              size="lg"
              class="space-x-0 logout-btn"
              v-tooltip.left="{ text: 'Click to Logout Now' }"
            />
          </div>
        </div>

        <div class="w-full flex space-x-10 px-4 font-bold flex-shrink-0">
          <div
            @click="changeTab('backlog')"
            :class="{
              'border-b-4 border-lime-300 duration-300':
                activeTab === 'backlog',
            }"
            class="pb-4 flex space-x-2 items-center cursor-pointer"
          >
            <Square3Stack3DIcon class="w-5 h-5 flex" />
            <span>Backlog</span>
          </div>
          <div
            @click="changeTab('priority-chart')"
            :class="{
              'border-b-4 border-lime-300 duration-300':
                activeTab === 'priority-chart',
            }"
            class="pb-4 flex space-x-2 items-center cursor-pointer"
          >
            <ArrowsPointingInIcon class="w-5 h-5" />
            <span>Priority Chart</span>
          </div>
          <div
            @click="changeTab('kanban-workflow')"
            :class="{
              'border-b-4 border-lime-300 duration-300':
                activeTab === 'kanban-workflow',
            }"
            class="pb-4 flex space-x-2 items-center cursor-pointer"
          >
            <ChartBarIcon class="w-5 h-5" />
            <span>Kanban Workflow</span>
          </div>

          <div
            @click="changeTab('task-repository')"
            :class="{
              'border-b-4 border-lime-300 duration-300':
                activeTab === 'task-repository',
            }"
            class="pb-4 flex space-x-2 items-center cursor-pointer"
          >
            <Square3Stack3DIcon class="w-5 h-5 flex" />
            <span>Task Repository</span>
          </div>
        </div>
      </div>

      <KanbanWorkFlow v-if="activeTab === 'kanban-workflow'" />

      <PriorityChart v-if="activeTab === 'priority-chart'" />

      <BackLog v-if="activeTab === 'backlog'" />

      <TaskRepository v-if="activeTab === 'task-repository'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { Switch } from "@headlessui/vue";
import Swal from "sweetalert2/dist/sweetalert2";

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
import SideBar from "../components/shared/SideBar.vue";
import KanbanWorkFlow from "../components/sections/KanbanWorkFlow.vue";
import TaskRepository from "../components/sections/TaskRepository.vue";
import PriorityChart from "../components/sections/PriorityChart.vue";
import BackLog from "../components/sections/BackLog.vue";
import Button from "../components/shared/Button.vue";
import Modal from "../components/shared/Modal.vue";
import Fab from "../components/shared/Fab.vue";
import Tag from "../components/shared/Tag.vue";
import Card from "../components/shared/Card.vue";
import Calendar from "../components/shared/Calendar.vue";

const authStore = useAuthStore();
const activeTab = ref("kanban-workflow");
const changeTab = (tab) => (activeTab.value = tab);
const router = useRouter();

const userLogout = () => {
  authStore.logout();
  router.push("/login");
};
const showLogout = () => {
  Swal.fire({
    title: "Logout",
    icon: "question",
    text: "Would you like to logout now?",
    showDenyButton: true,
    reverseButtons: true,
    confirmButtonText: "Yes, Proceed",
    denyButtonText: `No, Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      userLogout();
    } else if (result.isDenied) {
    }
  });
};

//Check If token expired, if so,,, logout the user
const checkIfTokenHasExpired = () => {
  const tokenExpiry = authStore.tokenExpiry;
  if (tokenExpiry && new Date().getTime() >= new Date(tokenExpiry).getTime()) {
    userLogout();
  }
};

let intervalId;

onMounted(() => {
  intervalId = setInterval(checkIfTokenHasExpired, 60000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
input {
  appearance: none;
}

progress[value]::-webkit-progress-value {
  background-image: -webkit-linear-gradient(
      -45deg,
      transparent 33%,
      rgba(0, 0, 0, 0.1) 33%,
      rgba(0, 0, 0, 0.1) 66%,
      transparent 66%
    ),
    -webkit-linear-gradient(top, rgba(255, 255, 255, 0.25), rgba(0, 0, 0, 0.25)),
    -webkit-linear-gradient(left, #09c, #f44);

  border-radius: 2px;
  background-size: 35px 20px, 100% 100%, 100% 100%;
}

.logout-btn > * + * {
  margin-left: 0rem !important;
  /* margin-right: 0rem;  */
}
</style>
