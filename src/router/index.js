// src/router/index.js
import { createRouter, createWebHistory } from "vue-router"
import GameView from "../views/GameView.vue"
import LastNumberView from "../views/LastNumberView.vue"
import LastNumberListView from "../views/LastNumberListView.vue"
import GameBoardView from "../views/GameBoardView.vue" // Importa GameBoardView

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: GameView,
    },
    {
      path: "/views/last-number",
      name: "last-number",
      component: LastNumberView,
    },
    {
      path: "/views/last-number-list/:direction?",
      name: "last-number-list",
      component: LastNumberListView,
    },
    {
      path: "/views/game-board",
      name: "game-board",
      component: GameBoardView, // Añade la nueva ruta
    },
    // Aquí puedes añadir más rutas para otras vistas
  ],
})

export default router
