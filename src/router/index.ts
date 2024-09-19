import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/pages/indexPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/:category",
    name: "home",
    component: HomeView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
