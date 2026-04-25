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
                marked: store.isBallMarked(cell.value),
                last: store.isLastMarked(cell.value),
              }"
              @click="store.toggleBall(cell.value)"
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
import ConfirmationModal from "../ConfirmationModal.vue"

const store = useAppStore()
const isConfirmModalOpen = ref(false)

const markedBalls = computed(() => store.gameState.markedBalls)

// Generación declarativa del layout del tablero (B-I-N-G-O, 1-75)
const BINGO_LETTERS = ["B", "I", "N", "G", "O"]
const NUMBERS_PER_COLUMN = 15

const boardLayout = computed(() => {
  const layout = []
  for (let colIndex = 0; colIndex < 5; colIndex++) {
    const letter = BINGO_LETTERS[colIndex]
    const column = [{ type: "letter", value: letter, id: `L-${colIndex}` }]

    for (let rowIndex = 1; rowIndex <= NUMBERS_PER_COLUMN; rowIndex++) {
      const numberValue = colIndex * NUMBERS_PER_COLUMN + rowIndex
      column.push({ type: "number", value: numberValue, id: numberValue })
    }
    layout.push(column)
  }
  return layout
})

// Funciones del Modal delegando la limpieza al Store
const requestReset = () => {
  isConfirmModalOpen.value = true
}

const executeReset = () => {
  store.resetBoard() // <-- Lógica movida al store
  isConfirmModalOpen.value = false
}
</script>

<style scoped>
@import "../../assets/layout/_modules.css";

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
  background-color: #ffaa33 !important;
  color: white !important;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(50%);
}
</style>
