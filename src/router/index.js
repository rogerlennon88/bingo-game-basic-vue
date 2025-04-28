// src/router/index.js

import { createRouter, createWebHistory } from "vue-router"
import GameView from "../views/GameView.vue" // Importa GameView
import LastNumberView from "../views/LastNumberView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: GameView, // Ahora la ruta principal usa GameView
    },
    {
      path: "/views/last-number",
      name: "last-number",
      component: LastNumberView,
    },
    // Aquí puedes añadir más rutas para otras vistas
  ],
})

export default router
