// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import GameView from '../views/GameView.vue';
import LastNumberView from '../views/LastNumberView.vue';
import LastNumberListView from '../views/LastNumberListView.vue';
import GameBoardView from '../views/GameBoardView.vue'; // Importa GameBoardView

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Game',
      component: GameView
    },
    {
      path: '/views/last-number',
      name: 'LastNumberView',
      component: LastNumberView
    },
    {
      path: '/views/last-number-list/:direction?',
      name: 'LastNumberList',
      component: LastNumberListView
    },
    {
      path: '/views/game-board/:direction?',
      name: 'GameBoardView',
      component: GameBoardView
    }
  ]
});

export default router;