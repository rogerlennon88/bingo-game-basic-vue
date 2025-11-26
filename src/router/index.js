// src/router/index.js
import { createRouter, createWebHistory } from "vue-router"
import GameView from "../views/GameView.vue"
import LastNumberView from "../views/LastNumberView.vue"
import LastNumberListView from "../views/LastNumberListView.vue"
import GameBoardView from "../views/GameBoardView.vue"
import GameModeView from "../views/GameModeView.vue"
import CounterView from "../views/CounterView.vue"
import MainObsFullHdView from "../views/MainObsFullHdView.vue"
import PatternsSliderView from "../views/PatternsSliderView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Game",
      component: GameView,
    },
    {
      path: "/views/last-number",
      name: "LastNumberView",
      component: LastNumberView,
    },
    {
      path: "/views/last-number-list/:direction?",
      name: "LastNumberList",
      component: LastNumberListView,
    },
    {
      path: "/views/game-board/:direction?",
      name: "GameBoardView",
      component: GameBoardView,
    },
    {
      path: "/views/game-mode",
      name: "GameModeView",
      component: GameModeView,
    },
    {
      path: "/views/counter",
      name: "CounterView",
      component: CounterView,
    },
    {
      path: "/views/main-obs-fullhd",
      name: "MainObsFullHdView",
      component: MainObsFullHdView,
    },
    {
      path: "/views/patterns-slider",
      name: "PatternsSliderView",
      component: PatternsSliderView,
    },
  ],
})

export default router
