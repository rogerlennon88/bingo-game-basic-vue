<template>
  <div id="game-board-mofv-view">
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

// Animación de nueva balota
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
/* Los estilos los hereda de tu main.css que importaremos en la vista maestra */
</style>
