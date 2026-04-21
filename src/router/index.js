import { createRouter, createWebHistory } from "vue-router"
import DashboardView from "../views/DashboardView.vue"
import StageMasterView from "../views/obs/StageMasterView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: DashboardView,
    },
    {
      path: "/views/obs/stage",
      name: "StageMaster",
      component: StageMasterView,
    },
    // Si intentan entrar a una ruta que no existe, los mandamos al Dashboard
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
})

export default router
