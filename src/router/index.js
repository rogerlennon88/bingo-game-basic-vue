import { createRouter, createWebHistory } from "vue-router";
// Importamos las nuevas vistas (las crearemos a continuación)
import DashboardView from "../views/DashboardView.vue";
import StageMasterView from "../views/obs/StageMasterView.vue";

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
    // Mantendremos las vistas individuales por si las necesitas en OBS por separado
    {
      path: "/views/game-board",
      name: "LegacyGameBoard",
      component: () => import("../views/GameBoardView.vue"),
    },
  ],
});

export default router;