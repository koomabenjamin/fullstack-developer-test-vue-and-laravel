<template>
  <div
    class="w-1/4 border-r h-full px-7 pt-7 pb-44 flex flex-col space-y-5 overflow-auto"
  >
    <div class="font-bold text-lg">Task Master</div>
    <Button
      label="Add New Task"
      icon="PlusIcon"
      color="bg-lime-300"
      size="xl"
    />

    <div class="space-y-4">
      <NavList :items="navItems" />
    </div>

    <div
      class="fixed bottom-0 w-1/4 h-auto left-0 p-7 bg-lime-50 border-t border-r"
    >
      <div class="flex items-center space-x-2 font-bold">
        <WalletIcon class="h-6 stroke-2" />
        <span class="text-sm">Free plan</span>
        <!-- {{allProjects}} -->
      </div>
      <div class="flex items-center justify-between space-x-2 text-xs mt-4">
        <span class="font-bold">Projects</span>
        <span class="text-slate-500">4/10</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-1.5 mb-4 my-2">
        <div class="bg-lime-500 h-1.5 rounded-full" style="width: 80%"></div>
      </div>
      <div class="flex items-center justify-between space-x-2 text-xs mt-2">
        <span class="font-bold">Tasks</span>
        <span class="text-slate-500">Unlimited</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { WalletIcon } from "@heroicons/vue/24/outline";
import Button from "./Button.vue";
import Fab from "./Fab.vue";
import Tag from "./Tag.vue";
import Card from "./Card.vue";
import NavList from "./NavItems.vue";

import { fetchAllProjectsData, allProjects } from "@/services/projectService";
import { fetchAllTagsData, allTags } from "@/services/tagService";
import { fetchAllTasksData, allTasks } from "@/services/taskService";
import { fetchAllMembersData, allMembers } from "@/services/memberService";
import {
  fetchAllCategoriesData,
  allCategories,
} from "@/services/categoryService";
import { useNavItemsStore } from "@/stores/navItems";

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

const updateCategoriesInNavItems = () => {
  navItemsStore.updateCategoriesInNavItems(allCategories.value);
};

onMounted(async () => {
  try {
    //=====Fetch all data======
    await Promise.all([
      fetchAllTagsData(),
      fetchAllProjectsData(),
      fetchAllCategoriesData(),
      fetchAllMembersData(),
      fetchAllTasksData(),
    ]);

    //=======Update the navigation items==
    updateTagsInNavItems();
    updateProjectsInNavItems();
    updateCategoriesInNavItems();
    updateMembersInNavItems();
    updateTaskListsInNavItems();
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
});
</script>

<style scoped></style>
