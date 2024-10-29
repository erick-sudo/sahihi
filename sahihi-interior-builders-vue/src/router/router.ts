import { createRouter, createWebHistory } from "vue-router";
import Signup from "../components/auth/Signup.vue";
import AuthLayout from "../components/auth/AuthLayout.vue";

const routes = [
  { path: "/signup", component: Signup },
  { path: "/", component: AuthLayout },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
