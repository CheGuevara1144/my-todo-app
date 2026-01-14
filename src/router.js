import { createRouter, createWebHistory } from "vue-router";
import TodoView from "./views/TodoView.vue";
import StatsView from "./views/StatsView.vue";

const routes = [
  { path: "/", component: TodoView },
  { path: "/stats", component: StatsView },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
