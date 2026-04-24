<template>
  <div id="game-board-refined" class="board-refined-container hardware-accelerated">
    <header class="board-header">
      <div v-for="column in boardData" :key="'h-' + column[0].id" class="header-cell">
        <span class="letter-text">{{ column[0].value }}</span>
      </div>
    </header>

    <main class="board-body">
      <div v-for="column in boardData" :key="'c-' + column[0].id" class="body-column">
        <div v-for="cell in column.slice(1)" :key="cell.id" class="num-cell">
          <span
            class="num-text"
            :class="{
              marked: isBallMarked(cell.value),
              'marked-animating': isAnimating(cell.value),
              lock: isBallMarked(cell.value),
            }"
          >
            {{ cell.value }}
          </span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()
const markedBalls = computed(() => store.gameState.markedBalls)

// Estandarización de constantes en inglés
const BINGO_LETTERS = ["B", "I", "N", "G", "O"]
const NUMBERS_PER_COLUMN = 15
const ANIMATION_DURATION = 2000

// Estado para controlar qué balotas están brillando actualmente
const animatingBalls = ref([])

// 1. Optimización: Tablero Generado Declarativamente (Computed)
// Al ser computed, se genera instantáneamente sin esperar al ciclo onMounted
const boardData = computed(() => {
  const data = []
  for (let colIndex = 0; colIndex < 5; colIndex++) {
    const letter = BINGO_LETTERS[colIndex]
    const column = [{ type: "letter", value: letter, id: `${letter}-ggb` }]

    for (let rowIndex = 1; rowIndex <= NUMBERS_PER_COLUMN; rowIndex++) {
      const numberValue = colIndex * NUMBERS_PER_COLUMN + rowIndex
      column.push({ type: "number", value: numberValue, id: numberValue })
    }
    data.push(column)
  }
  return data
})

// 2. Helpers limpios y en inglés
const isBallMarked = (ball) => markedBalls.value.includes(String(ball))
const isAnimating = (ball) => animatingBalls.value.includes(String(ball))

// 3. Watcher optimizado para detectar nuevas balotas
watch(
  markedBalls,
  (newVal, oldVal) => {
    // Si el tablero se limpia o no hay balotas anteriores, no animamos
    if (!oldVal || oldVal.length === 0) return

    // Filtramos cuáles son las balotas recién llegadas
    const newArrivals = newVal.filter((ball) => !oldVal.includes(ball))

    newArrivals.forEach((ball) => {
      if (!animatingBalls.value.includes(ball)) {
        // Añadimos a la lista de animación
        animatingBalls.value.push(ball)

        // Removemos de la lista después del tiempo establecido
        setTimeout(() => {
          animatingBalls.value = animatingBalls.value.filter((b) => b !== ball)
        }, ANIMATION_DURATION)
      }
    })
  },
  { deep: true },
)
</script>

<style scoped>
/* =========================================
   CONTENEDOR MAESTRO DEL TABLERO
   ========================================= */
.hardware-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

.board-refined-container {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 8px;
  padding: 16px;
  border-radius: 24px;
  font-family: "Aktiv Grotesk Ex Trial XBold", Arial, sans-serif;
}

/* =========================================
   ENCABEZADO (Letras B-I-N-G-O)
   ========================================= */
.board-header {
  background-color: inherit;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  padding: 0;
  align-items: inherit;
}

.header-cell {
  background-image: url("/views-media/main-obs-fullhd/bg-btn-letter.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: grid;
  place-items: center;
}

.letter-text {
  font-size: 6rem;
  font-weight: 900;
  color: #64043f;
  line-height: 1;
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 1;
  padding: 8px;
  width: 100%;
}

/* =========================================
   CUERPO (Grid de Balotas)
   ========================================= */
.board-body {
  background: #64043f;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  border: 3px solid #64043f;
  border-radius: 16px;
  overflow: clip;
}

.body-column {
  display: grid;
  grid-template-rows: repeat(15, 1fr);
  gap: 3px;
}

.num-cell {
  background-color: #fbfcfc;
  border-radius: 2px;
  overflow: clip;
}

.num-text {
  padding: 10px 20px;
  font-size: 3.8rem;
  font-weight: 700;
  color: #64043f80;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;
}

/* =========================================
   ESTADOS DINÁMICOS (Marcada y Animación)
   ========================================= */
.num-text.marked {
  background-image: url("/views-media/main-obs-fullhd/bg-btn-num.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 72%;
  color: #fdfefe;
  cursor: default;
}

.num-text.marked-animating {
  background-image: url("/views-media/main-obs-fullhd/bg-btn-num.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 72%;
  background-color: #e97451;
  color: #fff;
  animation: obs-ball-pop 0.5s alternate infinite ease-in-out;
}

@keyframes obs-ball-pop {
  0% {
    filter: brightness(1);
    transform: scale(1);
  }
  100% {
    background-color: rgb(255, 213, 128);
    color: rgb(192, 64, 0);
    box-shadow: inset 0 0 16px 1px rgb(255, 95, 31);
    filter: brightness(1.3) drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
    transform: scale(1.05);
  }
}
</style>
