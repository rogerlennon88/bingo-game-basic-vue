<!-- src/views/GameModeView.vue -->
<template>
  <div id="game-mode-view" class="module">
    <div class="layout-mode">
      <div id="grid-game-mode-view" class="grid-game-mode">
        <div v-for="(column, columnIndex) in gameModeData" :key="columnIndex" class="group">
          <div v-for="cell in column" :key="cell.id" class="cell">
            <span
              :id="cell.id"
              class="btn-ggm"
              :class="{
                letter: cell.type === 'letter',
                num: cell.type === 'number' && !cell.isMiddle,
                middle: cell.isMiddle,
                lock: cell.type === 'letter' || cell.isMiddle,
                marked: isPositionMarked(cell.id),
              }"
            >
              {{ cell.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"

const letters = ["B", "I", "N", "G", "O"]
const rows = 5
const gameModeData = ref([])
const markedPattern = ref([])
const updateInterval = ref(null) // Referencia para el intervalo

const generateGameModeData = () => {
  const data = []
  letters.forEach((letter, columnIndex) => {
    const column = []
    column.push({ type: "letter", value: letter, id: `${letter.toLowerCase()}-ggm` })
    for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {
      const id = `${letter.toLowerCase()}${rowIndex}`
      column.push({ type: "number", value: id, id: id, isMiddle: letter === "N" && rowIndex === 3 })
    }
    data.push(column)
  })
  gameModeData.value = data
}

const cargarGameModePattern = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/game-mode-data")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    markedPattern.value = data.gamePattern || []
  } catch (error) {
    console.error("Error al cargar el patrón del GameMode en la vista:", error)
  }
}

const isPositionMarked = (positionId) => {
  return markedPattern.value.includes(positionId)
}

onMounted(() => {
  generateGameModeData()
  cargarGameModePattern()
  updateInterval.value = setInterval(cargarGameModePattern, 1000) // Establecer el intervalo de actualización
})

onUnmounted(() => {
  clearInterval(updateInterval.value) // Limpiar el intervalo cuando el componente se desmonta
})
</script>

<style scoped>
/* game-mode-view */

.layout-mode {
  background-color: rgb(229, 228, 226);
  padding: calc(var(--gap) / 2);
  border-radius: 4px;
}

/* Grid Game Mode */
#grid-game-mode-view {
  display: grid;
  gap: 2px;
  grid-template-columns: repeat(5, 1fr);
}

/* Groups and Cells */
#grid-game-mode-view .group {
  display: grid;
  gap: 2px;
}
#grid-game-mode-view .cell {
  display: grid;
}

/* General Span */
#grid-game-mode-view .btn-ggm {
  color: white;
  aspect-ratio: 1 / 1;
  border: none;
  border-radius: 2px;
  display: grid;
  place-items: center;
  user-select: none;
}

/* Letter Span */
#grid-game-mode-view .letter {
  background-color: rgb(178, 190, 181);
  color: rgba(255, 255, 255, 0.5);
  font-size: 2.4rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) * 2 / 2);
}

/* Number Span */
#grid-game-mode-view .num {
  background-color: rgb(137, 148, 153);
  color: rgba(255, 255, 255, 0.32);
  font-size: 1.2rem;
  font-weight: var(--fw-bold);
}

/* Middle Span */
#grid-game-mode-view .middle {
  background-color: rgb(211, 211, 211);
  color: rgb(224, 223, 223);
  font-size: 1.2rem;
  font-weight: var(--fw-bold);
}

/* Letter Span Status */
#grid-game-mode-view .letter.marked {
  background-color: rgb(138, 154, 91);
  color: rgba(178, 190, 181, 0.8);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(132, 136, 132, 0.5);
}

/* Number Span Status */
#grid-game-mode-view .num.marked {
  background-color: rgb(233, 116, 81);
  color: rgba(250, 249, 246, 0.75);
  text-shadow: 2px 2px 2px rgba(139, 64, 0, 0.75);
  box-shadow: inset 0 0 8px 1px rgba(139, 64, 0, 0.64);
}

/* Middle Span Status */
#grid-game-mode-view .middle.marked {
  background-color: rgb(95, 158, 160);
  color: rgb(175, 225, 175);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(64, 130, 109, 0.5);
}

/* Border Radius Grid */
#grid-game-mode-view .group:first-child .cell:first-child span {
  border-top-left-radius: 4px;
}
#grid-game-mode-view .group:last-child .cell:first-child span {
  border-top-right-radius: 4px;
}
</style>
