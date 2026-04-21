<template>
  <div id="game-board-mofv-view" class="hardware-accelerated">
    <div id="header-game-board-mofv">
      <span v-for="column in tableroData" :key="column[0].id" class="cell letter">
        {{ column[0].value }}
      </span>
    </div>
    <div id="grid-game-board-mofv" class="board-y">
      <div v-for="column in tableroData" :key="column[0].id" class="group">
        <div v-for="cell in column.slice(1)" :key="cell.id" class="cell">
          <span
            v-if="cell.type === 'number'"
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
import { ref, computed, watch, onMounted } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()
const markedBalls = computed(() => store.gameState.markedBalls)

const letters = ["B", "I", "N", "G", "O"]
const numbersPerColumn = 15
const tableroData = ref([])
const animatingBalls = ref([])
const animationDuration = 2000

watch(
  markedBalls,
  (newVal, oldVal) => {
    if (!oldVal || oldVal.length === 0) return
    const newBalls = newVal.filter((ball) => !oldVal.includes(ball))
    newBalls.forEach((ball) => {
      if (!animatingBalls.value.includes(ball)) {
        animatingBalls.value.push(ball)
        setTimeout(() => {
          animatingBalls.value = animatingBalls.value.filter((b) => b !== ball)
        }, animationDuration)
      }
    })
  },
  { deep: true },
)

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

const isBalotaMarcada = (balota) => markedBalls.value.includes(String(balota))
const isAnimating = (balota) => animatingBalls.value.includes(String(balota))

onMounted(() => generateTableroData())
</script>

<style scoped>
/* OPTIMIZACIÓN DE GPU */
.hardware-accelerated {
  transform: translateZ(0);
  contain: layout paint;
}

.num {
  /* Prepara la celda para cambios rápidos de estado */
  will-change: background-color, box-shadow, color;
  transition:
    background-color 0.2s,
    box-shadow 0.2s,
    color 0.2s;
}

/* Redefinimos la animación blink para que sea 100% GPU friendly usando opacity en un pseudo-elemento si fuera necesario, 
   o colores sólidos. Mantenemos tu diseño pero aislando el render */
@keyframes smooth-blink {
  0% {
    transform: scale(1);
  }
  50% {
    background-color: rgb(255, 213, 128);
    color: rgb(192, 64, 0);
    box-shadow: inset 0 0 16px 1px rgb(255, 95, 31);
    transform: scale(1.05); /* Pequeño realce visual 3D */
  }
  100% {
    transform: scale(1);
  }
}

.marked-animating {
  background-color: rgb(233, 116, 81);
  color: white;
  animation: smooth-blink 1s ease-in-out 2;
  transform: translateZ(0);
}
</style>
