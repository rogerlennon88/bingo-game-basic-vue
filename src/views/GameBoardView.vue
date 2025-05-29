<!-- src/views/GameBoardView.vue -->
<template>
  <div id="game-board-view">
    <div id="grid-game-board" :class="gridDirectionClass">
      <div v-for="(column, columnIndex) in tableroData" :key="columnIndex" class="group">
        <div v-for="cell in column" :key="cell.id" class="cell">
          <span v-if="cell.type === 'letter'" :id="cell.id" class="btn-ggb letter lock">
            {{ cell.value }}
          </span>
          <span
            v-else-if="cell.type === 'number'"
            :id="cell.id"
            class="btn-ggb num"
            :class="{
              marked: isBalotaMarcada(cell.value) && !isAnimating(cell.value),
              'marked-animating': isAnimating(cell.value),
              lock: isBalotaMarcada(cell.value),
            }"
          >
            {{ cell.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const letters = ["B", "I", "N", "G", "O"]
const numbersPerColumn = 15
const tableroData = ref([])
const markedBalls = ref([])
const animatingBalls = ref([])
const animationDuration = 2000 // Duración de la animación en milisegundos
const updateInterval = ref(null)

const direction = computed(() => route.params.direction)

const gridDirectionClass = computed(() => {
  if (direction.value === "x") {
    return "board-x"
  } else {
    return "board-y"
  }
})

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

const isAnimating = (balota) => {
  return animatingBalls.value.includes(String(balota))
}

const cargarDatosGameBoard = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/game-board-data")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    const newMarkedBalls = data.markedBalls || []

    // Identificar las nuevas balotas marcadas para la animación
    newMarkedBalls.forEach((ball) => {
      if (!markedBalls.value.includes(ball) && !animatingBalls.value.includes(ball)) {
        animatingBalls.value.push(ball)
        // Remover la balota de la lista de animación después de la duración
        setTimeout(() => {
          animatingBalls.value = animatingBalls.value.filter((b) => b !== ball)
        }, animationDuration)
      }
    })

    markedBalls.value = newMarkedBalls
  } catch (error) {
    console.error("Error al cargar los datos del GameBoard:", error)
  }
}

onMounted(() => {
  generateTableroData()
  cargarDatosGameBoard()
  updateInterval.value = setInterval(cargarDatosGameBoard, 1000)
})

onUnmounted(() => {
  clearInterval(updateInterval.value)
})
</script>

<style scoped>
/* game-board */
#game-board-view {
  width: 100%;
  height: 100%;
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
  background-color: rgb(250, 213, 165);
  border-radius: calc(var(--gap) / 4);
  box-shadow: inset 0 0 8px 1px rgb(204, 85, 0);
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

/* Animación destellante */
@keyframes blink {
  50% {
    background-color: rgb(255, 213, 128);
    color: rgb(192, 64, 0);
    text-shadow: 2px 2px 2px rgb(255, 253, 208);
    box-shadow: inset 0 0 16px 1px rgb(255, 95, 31);
  }
}

#grid-game-board .num.marked-animating {
  background-color: rgb(233, 116, 81); /* Un color llamativo para la animación */
  color: white;
  animation: blink 1s ease-in-out 2; /* Destella 2 veces */
}

/* Border Radius Grid Items */
#grid-game-board .group:first-child .cell:first-child .btn-ggb,
#grid-game-board .group:first-child .cell {
  border-top-left-radius: calc(var(--gap) / 2);
}
#grid-game-board .group:first-child .cell:last-child .btn-ggb,
#grid-game-board .group:first-child .cell {
  border-bottom-left-radius: calc(var(--gap) / 2);
}
#grid-game-board .group:last-child .cell:first-child .btn-ggb,
#grid-game-board .group:last-child .cell {
  border-top-right-radius: calc(var(--gap) / 2);
}
#grid-game-board .group:last-child .cell:last-child .btn-ggb,
#grid-game-board .group:last-child .cell {
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
