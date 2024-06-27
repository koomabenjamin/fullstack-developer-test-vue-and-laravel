import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavItemsStore = defineStore("navItems", () => {
  const navItems = ref([
    { label: "Plan", icon: "CalendarIcon", subList: [] },
    {
      label: "Task List",
      name: "task",
      icon: "ClipboardDocumentListIcon",
      subList: [],
    },
    {
      label: "Projects",
      name: "project",
      icon: "FolderIcon",
      subList: [],
    },

    {
      label: "Categories",
      name: "category",
      icon: "FolderIcon",
      subList: [],
    },

    {
      label: "Tags",
      name: "tag",
      icon: "TagIcon",
      subList: [],
    },
    {
      label: "Members",
      name: "member",
      icon: "UserGroupIcon",
      subList: [],
    },
  ]);

  const updateProjectsInNavItems = (projects) => {
    const projectsNavItem = navItems.value.find(
      (item) => item.label === "Projects"
    );
    if (projectsNavItem) {
      projectsNavItem.subList = projects.map((project) => ({
        name: project.project_name,
        color: project.project_color,
      }));
    }
  };

  const updateTagsInNavItems = (tags) => {
    const tagsNavItem = navItems.value.find((item) => item.label === "Tags");
    if (tagsNavItem) {
      tagsNavItem.subList = tags.map((tag) => ({
        name: tag.tag_name,
        color: tag.tag_color,
      }));
    }
  };

  const updateCategoriesInNavItems = (categories) => {
    const categoriesNavItem = navItems.value.find(
      (item) => item.label === "Categories"
    );
    if (categoriesNavItem) {
      categoriesNavItem.subList = categories.map((category) => ({
        name: category.category_name,
        color: category.category_color,
      }));
    }
  };

  const updateMembersInNavItems = (members) => {
    const membersNavItem = navItems.value.find(
      (item) => item.label === "Members"
    );
    if (membersNavItem) {
      membersNavItem.subList = members.map((member) => ({
        name: member.name,
        color: member.color,
      }));
    }
  };

  const updateTaskListsInNavItems = (tasks) => {
    const taskListsNavItem = navItems.value.find(
      (item) => item.label === "Task List"
    );
    if (taskListsNavItem) {
      taskListsNavItem.subList = tasks.map((task) => ({
        name: task.task_name,
        color: task.task_color,
      }));
    }
  };

  return {
    navItems,
    updateProjectsInNavItems,
    updateTagsInNavItems,
    updateMembersInNavItems,
    updateTaskListsInNavItems,
    updateCategoriesInNavItems,
  };
});
