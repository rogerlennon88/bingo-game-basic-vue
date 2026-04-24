<template>
  <div id="game-board-control" class="module">
    <div class="grid-container">
      <div id="grid-game-board" class="board-y">
        <div v-for="(column, columnIndex) in boardLayout" :key="columnIndex" class="group">
          <div v-for="cell in column" :key="cell.id" class="cell">
            <button v-if="cell.type === 'letter'" class="btn-ggb letter lock">
              {{ cell.value }}
            </button>

            <button
              v-else
              class="btn-ggb num"
              :class="{
                marked: isMarked(cell.value),
                last: isLastMarked(cell.value),
              }"
              @click="toggleBall(cell.value)"
            >
              {{ cell.value }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="module-controls">
      <button class="btn btn-primary" @click="requestReset" :disabled="markedBalls.length === 0">Limpiar Tablero</button>
    </div>

    <Teleport to="body">
      <ConfirmationModal
        :isOpen="isConfirmModalOpen"
        title="Limpiar Tablero"
        message="¿Estás completamente seguro de que deseas limpiar todo el tablero? Esta acción no se puede deshacer."
        @confirm="executeReset"
        @cancel="isConfirmModalOpen = false"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useAppStore } from "../../stores/appStore"
import ConfirmationModal from "../ConfirmationModal.vue" // Asegúrate de que la ruta sea correcta

const store = useAppStore()

// Estado del Modal
const isConfirmModalOpen = ref(false)

// Lógica para generar el diseño (B-I-N-G-O)
const letters = ["B", "I", "N", "G", "O"]
const boardLayout = computed(() => {
  const layout = []
  for (let i = 0; i < 5; i++) {
    const column = [{ type: "letter", value: letters[i], id: `L-${i}` }]
    for (let j = 1; j <= 15; j++) {
      column.push({ type: "number", value: i * 15 + j, id: i * 15 + j })
    }
    layout.push(column)
  }
  return layout
})

const markedBalls = computed(() => store.gameState.markedBalls)

const isMarked = (ball) => markedBalls.value.includes(String(ball))
const isLastMarked = (ball) => markedBalls.value[0] === String(ball)

const toggleBall = (ball) => {
  const ballStr = String(ball)
  let newList = [...markedBalls.value]

  if (newList.includes(ballStr)) {
    if (isLastMarked(ball)) {
      newList.shift()
      store.updateGameState({
        markedBalls: newList,
        counter: Math.max(0, store.gameState.counter - 1),
      })
    }
  } else {
    newList.unshift(ballStr)
    store.updateGameState({
      markedBalls: newList,
      counter: store.gameState.counter + 1,
    })
  }
}

// Funciones del Modal
const requestReset = () => {
  isConfirmModalOpen.value = true
}

const executeReset = () => {
  store.updateGameState({ markedBalls: [], counter: 0 })
  isConfirmModalOpen.value = false
}
</script>

<style scoped>
/* Reutilizamos tus estilos CSS originales para no dañar el aspecto visual */
@import "../../assets/layout/_modules.css";
/* ... tus estilos de GameBoard ... */
#game-board {
  border-radius: 4px;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 2px;
}
#grid-game-board {
  background-color: #2471a3;
  padding: 2px;
  display: grid;
  gap: 2px;
}
#grid-game-board.board-y {
  grid-template-columns: repeat(5, 1fr);
}
#grid-game-board.board-y .group {
  grid-template-rows: auto repeat(15, 1fr);
}
#grid-game-board .group {
  display: grid;
  gap: 2px;
}
#grid-game-board .cell {
  display: grid;
}
#grid-game-board .btn-ggb {
  color: white;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
}
#grid-game-board .letter {
  background-color: rgb(84, 153, 199);
  font-size: 2.4rem;
  font-weight: var(--fw-bold);
  aspect-ratio: inherit;
  padding: calc(var(--gap));
}
#grid-game-board .num {
  background-color: rgb(251, 252, 252);
  color: rgb(52, 73, 94);
  font-size: 4rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) / 2);
}
#grid-game-board .letter:hover {
  background-color: rgb(137, 207, 240);
  color: rgb(0, 71, 171);
  text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.75);
}
#grid-game-board .letter:active {
  background-color: rgb(70, 130, 180);
  color: rgba(250, 249, 246, 0.32);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(8, 24, 168, 0.5);
}
#grid-game-board .letter.marked {
  background-color: rgb(70, 130, 180);
  color: rgba(250, 249, 246, 0.32);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  cursor: default;
  box-shadow: inset 0 0 8px 1px rgba(8, 24, 168, 0.5);
}
@media (hover: hover) {
  #grid-game-board .num:hover {
    background-color: rgb(255, 170, 51);
    color: var(--color-white);
  }
}
#grid-game-board .num.marked {
  background-color: rgb(193, 154, 107);
  color: rgba(250, 249, 246, 0.75);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  cursor: default;
  box-shadow: inset 0 0 8px 1px rgba(0, 0, 0, 0.5);
}
#game-board--control {
  background-color: rgba(237, 234, 222, 0.75);
  width: 100%;
  padding: var(--gap);
  border-radius: calc(var(--gap) / 2);
}
#game-board--control .game-controls-list {
  display: grid;
  gap: var(--gap, 8px);
  grid-auto-flow: column;
  justify-content: center;
}
#grid-game-board .group:first-child .cell:first-child .btn-ggb {
  border-top-left-radius: 2px;
}
#grid-game-board .group:first-child .cell:last-child .btn-ggb {
  border-bottom-left-radius: 2px;
}
#grid-game-board .group:last-child .cell:first-child .btn-ggb {
  border-top-right-radius: 2px;
}
#grid-game-board .group:last-child .cell:last-child .btn-ggb {
  border-bottom-right-radius: 2px;
}

.last {
  background-color: #ffaa33 !important; /* Resalte para la última balota */
  color: white !important;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(50%);
}
</style>
