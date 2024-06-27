import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import Dashboard from "@/views/MainView.vue";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/", name: "Dashboard", component: Dashboard },
];

const router = createRouter({
  scrollBehavior: function () {
    return { x: 0, y: 0 };
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadUserFromStorage();

  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !authStore.isAuthenticated) {
    authStore.returnUrl = to.fullPath;
    return next("/login");
  }

  if (to.path === "/login" && authStore.isAuthenticated) {
    return next("/");
  }

  next();
});

export default router;
