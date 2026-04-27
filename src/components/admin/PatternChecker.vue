<template>
  <div id="game-mode" class="module">
    <h2 class="title-2">Modo de Juego</h2>

    <div class="layout-mode">
      <div id="grid-game-mode" class="grid-game-mode">
        <div v-for="(column, columnIndex) in gameModeData" :key="columnIndex" class="group">
          <div v-for="cell in column" :key="cell.id" class="cell">
            <button
              :id="cell.id"
              class="btn-ggm"
              :class="{
                letter: cell.type === 'letter',
                num: cell.type === 'number' && !cell.isMiddle,
                middle: cell.isMiddle,
                lock: cell.type === 'letter' || cell.isMiddle,
                marked: store.isPatternPositionMarked(cell.id),
              }"
              @click="cell.type === 'number' && !cell.isMiddle && store.togglePatternPosition(cell.id)"
            >
              {{ cell.value }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="game-mode--control" class="module-controls">
      <ul class="game-controls-list">
        <li class="game-controls-item">
          <button
            id="btn-clear-mode"
            class="btn btn-primary"
            type="button"
            title="Limpiar Patrón de Juego"
            @click="requestAction('clear')"
            :class="{ lock: !hasSelectedPattern, disabled: !hasSelectedPattern }"
            :disabled="!hasSelectedPattern"
          >
            <span class="btn-text">Limpiar Patrón</span>
          </button>
        </li>
        <li class="game-controls-item">
          <button
            id="btn-fill-mode"
            class="btn btn-primary"
            type="button"
            title="Llenar Patrón de Juego Completo"
            @click="requestAction('fill')"
            :class="{ lock: isPatternFull, disabled: isPatternFull }"
            :disabled="isPatternFull"
          >
            <span class="btn-text">Llenar Patrón</span>
          </button>
        </li>
      </ul>
    </div>

    <Teleport to="body">
      <ConfirmationModal
        :isOpen="modalConfig.isOpen"
        :title="modalConfig.title"
        :message="modalConfig.message"
        @confirm="executeAction"
        @cancel="modalConfig.isOpen = false"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { useAppStore } from "../../stores/appStore"
import ConfirmationModal from "../ConfirmationModal.vue"

const store = useAppStore()

// --- CONSTANTES ---
const BINGO_LETTERS = ["B", "I", "N", "G", "O"]
const ROWS_PER_COLUMN = 5
const FULL_PATTERN = [
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "i1",
  "i2",
  "i3",
  "i4",
  "i5",
  "n1",
  "n2",
  "n4",
  "n5",
  "g1",
  "g2",
  "g3",
  "g4",
  "g5",
  "o1",
  "o2",
  "o3",
  "o4",
  "o5",
]

// --- ESTADO Y LÓGICA DEL MODAL DINÁMICO ---
const modalConfig = ref({
  isOpen: false,
  title: "",
  message: "",
  actionType: null, // 'clear' o 'fill'
})

const requestAction = (type) => {
  if (type === "clear") {
    modalConfig.value = {
      isOpen: true,
      title: "Limpiar Patrón",
      message: "¿Seguro que deseas borrar el patrón actual? Se limpiarán todas las casillas.",
      actionType: "clear",
    }
  } else if (type === "fill") {
    modalConfig.value = {
      isOpen: true,
      title: "Llenar Patrón",
      message: "¿Seguro que deseas seleccionar todas las casillas para un patrón de cartón lleno?",
      actionType: "fill",
    }
  }
}

const executeAction = () => {
  if (modalConfig.value.actionType === "clear") {
    store.updateGameState({ gamePattern: [] })
  } else if (modalConfig.value.actionType === "fill") {
    store.updateGameState({ gamePattern: [...FULL_PATTERN] })
  }
  modalConfig.value.isOpen = false
}

// --- GENERADOR DEL TABLERO OPTIMIZADO ---
const gameModeData = computed(() => {
  const data = []
  BINGO_LETTERS.forEach((letter) => {
    const letterLower = letter.toLowerCase()
    const column = [{ type: "letter", value: letter, id: `${letterLower}-ggm` }]

    for (let rowIndex = 1; rowIndex <= ROWS_PER_COLUMN; rowIndex++) {
      const id = `${letterLower}${rowIndex}`
      column.push({
        type: "number",
        value: id,
        id: id,
        isMiddle: letter === "N" && rowIndex === 3,
      })
    }
    data.push(column)
  })
  return data
})

// --- ESTADOS REACTIVOS DE UI ---
const hasSelectedPattern = computed(() => store.gameState.gamePattern.length > 0)
const isPatternFull = computed(() => store.gameState.gamePattern.length === FULL_PATTERN.length)
</script>

<style scoped>
/* =========================================
   ESTILOS ORIGINALES INTACTOS 
   ========================================= */
#game-mode {
  grid-template-rows: auto 1fr auto;
  place-items: inherit;
}
.layout-mode {
  background-color: rgb(229, 228, 226);
  padding: calc(var(--gap) / 2);
  border-radius: 4px;
  display: grid;
}
#grid-game-mode {
  display: grid;
  gap: 2px;
  grid-template-columns: repeat(5, 1fr);
}
#grid-game-mode .group {
  display: grid;
  gap: 2px;
  grid-template-rows: auto repeat(5, 1fr);
}
#grid-game-mode .cell {
  display: grid;
}
#grid-game-mode .btn-ggm {
  color: white;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
}
#grid-game-mode .letter {
  background-color: rgb(178, 190, 181);
  color: rgba(255, 255, 255, 0.5);
  font-size: 2.4rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) * 2 / 2);
}
#grid-game-mode .num {
  background-color: rgb(137, 148, 153);
  color: rgba(255, 255, 255, 0.32);
  font-size: 1.2rem;
  font-weight: var(--fw-bold);
}
#grid-game-mode .middle {
  background-color: rgb(211, 211, 211);
  color: rgb(224, 223, 223);
  font-size: 1.2rem;
  font-weight: var(--fw-bold);
}

@media (hover: hover) {
  #grid-game-mode .num:hover {
    background-color: rgb(255, 170, 51);
    color: var(--color-white);
  }
}

#grid-game-mode .letter:hover {
  background-color: rgb(138, 154, 91);
  color: rgb(95, 133, 117);
}
#grid-game-mode .letter.marked,
#grid-game-mode .letter:active {
  background-color: rgb(95, 133, 117);
  color: rgba(178, 190, 181, 0.8);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(132, 136, 132, 0.5);
}
#grid-game-mode .num.marked,
#grid-game-mode .num:active {
  background-color: rgb(233, 116, 81);
  color: rgba(250, 249, 246, 0.75);
  text-shadow: 2px 2px 2px rgba(139, 64, 0, 0.75);
  box-shadow: inset 0 0 8px 1px rgba(139, 64, 0, 0.64);
}
#grid-game-mode .middle:hover {
  background-color: rgb(95, 158, 160);
  color: rgb(175, 225, 175);
}
#grid-game-mode .middle:active {
  background-color: rgb(95, 133, 117);
  color: rgba(224, 223, 223, 0.75);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(64, 130, 109, 0.5);
}
#grid-game-mode .group:first-child .cell:first-child button {
  border-top-left-radius: 4px;
}
#grid-game-mode .group:last-child .cell:first-child button {
  border-top-right-radius: 4px;
}
#game-mode--control {
  width: 100%;
  padding: var(--gap);
  border-radius: calc(var(--gap) / 2);
  margin-top: 4px;
}
#game-mode--control .game-controls-list {
  display: grid;
  gap: var(--gap, 8px);
  grid-auto-flow: column;
  justify-content: center;
}

/* Modificadores extra (Disabled State) */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(50%);
}
</style>
