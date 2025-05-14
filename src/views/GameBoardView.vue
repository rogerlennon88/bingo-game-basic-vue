<template>
  <div id="game-board-view">
    <div id="grid-game-board" class="board-y">
      <div v-for="(column, columnIndex) in tableroData" :key="columnIndex" class="group">
        <div v-for="cell in column" :key="cell.id" class="cell">
          <span v-if="cell.type === 'letter'" :id="cell.id" class="btn-ggb letter lock">
            {{ cell.value }}
          </span>
          <span
            v-else-if="cell.type === 'number'"
            :id="cell.id"
            class="btn-ggb num"
            :class="{ marked: isBalotaMarcada(cell.value), lock: isBalotaMarcada(cell.value) }"
          >
            {{ cell.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"

const letters = ["B", "I", "N", "G", "O"]
const numbersPerColumn = 15
const tableroData = ref([])
const markedBalls = ref([])
const updateInterval = ref(null) // Referencia para el intervalo

const generateTableroData = () => {
  const data = []
  for (let i = 0; i < 5; i++) {
    const column = []
    column.push({ type: "letter", value: letters[i], id: `${letters[i]}-ggb` })
    for (let j = 1; j <= numbersPerColumn; j++) {
      column.push({ type: "number", value: i * numbersPerColumn + j, id: i * numbersPerColumn + j })
    }
    data.push(column)
  }
  tableroData.value = data
}

const isBalotaMarcada = (balota) => {
  return markedBalls.value.includes(String(balota))
}

const cargarDatosGameBoard = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/game-board-data")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    markedBalls.value = data.markedBalls || []
    console.log("Datos del GameBoard actualizados en GameBoardView:", markedBalls.value)
  } catch (error) {
    console.error("Error al cargar los datos del GameBoard:", error)
  }
}

onMounted(() => {
  generateTableroData()
  cargarDatosGameBoard() // Cargar los datos iniciales
  updateInterval.value = setInterval(cargarDatosGameBoard, 1000) // Establecer el intervalo de actualización (cada 1 segundo)
})

onUnmounted(() => {
  clearInterval(updateInterval.value) // Limpiar el intervalo cuando el componente se desmonta
})
</script>

<style scoped>
/* game-board */
#game-board-view {
  display: flex;
}

/* Grid Game Board */
#grid-game-board {
  background-color: rgb(36, 113, 163);
  border: 8px solid rgb(36, 113, 163);
  border-radius: 4px;
  display: grid;
  gap: 2px;
}

/* Groups and Cells */
#grid-game-board .group {
  display: grid;
  gap: 2px;
}
#grid-game-board .cell {
  display: grid;
}

/* General Span (reemplaza Button) */
#grid-game-board .btn-ggb {
  color: white;
  aspect-ratio: 3 / 2;
  border: none;
  border-radius: calc(var(--gap) / 4);
  display: grid;
  place-items: center;
  user-select: none;
}

/* Letter Span */
#grid-game-board .letter {
  background-color: rgb(84, 153, 199);
  font-size: 3rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) / 2);
}

/* Number Span */
#grid-game-board .num {
  background-color: rgb(251, 252, 252);
  color: rgb(52, 73, 94);
  font-size: 3rem;
  font-weight: var(--fw-bold);
}

/* Letter Span Status */
#grid-game-board .letter.marked {
  background-color: rgb(70, 130, 180);
  color: rgba(250, 249, 246, 0.32);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  cursor: default;
  box-shadow: inset 0 0 8px 1px rgba(8, 24, 168, 0.5);
}

/* Number Span Status */
#grid-game-board .num.marked {
  background-color: rgb(193, 154, 107);
  color: rgba(250, 249, 246, 0.75);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  cursor: default;
  box-shadow: inset 0 0 8px 1px rgba(0, 0, 0, 0.5);
}

/* Border Radius Grid Items */
#grid-game-board .group:first-child .cell:first-child .btn-ggb {
  border-top-left-radius: calc(var(--gap) / 2);
}
#grid-game-board .group:first-child .cell:last-child .btn-ggb {
  border-bottom-left-radius: calc(var(--gap) / 2);
}
#grid-game-board .group:last-child .cell:first-child .btn-ggb {
  border-top-right-radius: calc(var(--gap) / 2);
}
#grid-game-board .group:last-child .cell:last-child .btn-ggb {
  border-bottom-right-radius: calc(var(--gap) / 2);
}

/* Horizontal Grid */
#grid-game-board.board-x {
  grid-template-rows: repeat(5, 1fr);
}
#grid-game-board.board-x .group {
  grid-template-columns: repeat(16, 1fr);
}

/* Vertical Grid */
#grid-game-board.board-y {
  grid-template-columns: repeat(5, 1fr);
}
#grid-game-board.board-y .group {
  grid-template-rows: repeat(16, 1fr);
}
</style>
