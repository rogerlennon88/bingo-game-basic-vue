<template>
  <div id="main-obs-fullhd-view">
    <section id="main-obs-fullhd--game-board">
      <div id="game-board-mofv-view">
        <div id="header-game-board-mofv">
          <span v-for="column in tableroData" :key="column[0].id" class="cell letter">
            {{ column[0].value }}
          </span>
        </div>
        <div id="grid-game-board-mofv" :class="gridDirectionClass">
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
    </section>
    <section id="main-obs-fullhd--ball-cam">
      <div class="ball-cam-mod ck">ball-cam</div>
    </section>
    <section id="main-obs-fullhd--studio-cam">
      <div class="studio-cam-mod ck">studio-cam</div>
    </section>
    <section id="main-obs-fullhd--group">
      <section id="main-obs-fullhd--display-ads">
        <div class="display-ads ck">display-ads</div>
      </section>
      <section id="main-obs-fullhd--score">
        <div class="score">
          <h3 class="score--title">Últimas Balotas</h3>
          <div class="score--body">
            <div id="last-number-mofv-view" class="ball" :class="'ball-' + getColumnLetter(lastNumber)">
              <span class="mofv-letter">{{ getColumnLetter(lastNumber) }}</span>
              <span class="mofv-number">{{ lastNumber }}</span>
            </div>
            <ul id="last-number-list-mofv-view">
              <li class="item" v-for="i in 3" :key="i">
                <span class="ball" :class="'ball-' + getColumnLetter(displayedNumbers[i])">
                  <span class="mofv-letter">{{ getColumnLetter(displayedNumbers[i]) }}</span>
                  <span class="mofv-number">{{ displayedNumbers[i] || "" }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </section>
    <section id="main-obs-fullhd--prize-info">
      <div class="prize-info ck"></div>
    </section>
    <section id="main-obs-fullhd--game-mode">
      <div class="game-mode ck">game-mode</div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useGameData } from "../composables/useGameData" // Importar Composable
import "../assets/view-styles/main-obs-fullhd/main.css"

const route = useRoute()

// 1. CONEXIÓN OPTIMIZADA (Polling cada 1s)
const { markedBalls } = useGameData(1000)

// 2. LÓGICA VISUAL
const letters = ["B", "I", "N", "G", "O"]
const numbersPerColumn = 15
const tableroData = ref([])
const animatingBalls = ref([])
const animationDuration = 2000

// 3. ANIMACIÓN REACTIVA
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
  { deep: true }
)

// 4. COMPUTADAS
const lastNumber = computed(() => (markedBalls.value.length > 0 ? markedBalls.value[0] : ""))

const displayedNumbers = computed(() => {
  const result = { 1: "", 2: "", 3: "" }
  for (let i = 1; i <= 3; i++) {
    if (markedBalls.value.length > i) result[i] = markedBalls.value[i]
  }
  return result
})

const direction = computed(() => route.params.direction)
const gridDirectionClass = computed(() => (direction.value === "x" ? "board-x" : "board-y"))

// 5. AUXILIARES
const getColumnLetter = (ballNumber) => {
  if (!ballNumber) return ""
  const n = Number(ballNumber)
  if (n >= 1 && n <= 15) return "b"
  if (n >= 16 && n <= 30) return "i"
  if (n >= 31 && n <= 45) return "n"
  if (n >= 46 && n <= 60) return "g"
  if (n >= 61 && n <= 75) return "o"
  return ""
}

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

onMounted(() => {
  generateTableroData()
})
</script>

<style scoped></style>
