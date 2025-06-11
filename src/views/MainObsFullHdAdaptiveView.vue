<template>
  <div id="main-obs-fullhd-adaptive-view">
    <section id="main-obs-fullhd-adaptive--game-board">
      <div id="game-board-mofva-view">
        <div id="header-game-board-mofva">
          <span v-for="column in tableroData" :key="column[0].id" class="cell letter">
            {{ column[0].value }}
          </span>
        </div>
        <div id="grid-game-board-mofva" :class="gridDirectionClass">
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
    <section id="main-obs-fullhd-adaptive--ball-cam">
      <div class="ball-cam-mod ck">ball-cam</div>
    </section>
    <section id="main-obs-fullhd-adaptive--studio-cam">
      <div class="studio-cam-mod ck">studio-cam</div>
    </section>
    <section id="main-obs-fullhd-adaptive--group">
      <section id="main-obs-fullhd-adaptive--display-ads">
        <div class="display-ads ck">display-ads</div>
      </section>
      <section id="main-obs-fullhd--score">
        <div class="score">
          <h3 class="score--title">Últimas Balotas</h3>
          <div class="score--body">
            <div id="last-number-mofva-view" class="ball" :class="'ball-' + getColumnLetter(lastNumber)">
              <span class="mofva-letter">{{ getColumnLetter(lastNumber) }}</span>
              <span class="mofva-number">{{ lastNumber }}</span>
            </div>
            <ul id="last-number-list-mofva-view">
              <li class="item" v-for="i in 3" :key="i">
                <span class="ball" :class="'ball-' + getColumnLetter(displayedNumbers[i])">
                  <span class="mofva-letter">{{ getColumnLetter(displayedNumbers[i]) }}</span>
                  <span class="mofva-number">{{ displayedNumbers[i] || "" }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </section>
    <section id="main-obs-fullhd-adaptive--prize-info">
      <div class="prize-info ck">
        <h3 class="prize-info--title">Premio:</h3>
        <div class="prize-info--description">$10.000.000</div>
      </div>
    </section>
    <section id="main-obs-fullhd-adaptive--game-mode">
      <div class="game-mode ck">game-mode</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useRoute } from "vue-router"
import LastNumber from "../components/modules/LastNumber.vue"
import "../assets/view-styles/main-obs-fullhd-adaptive/main.css"

const route = useRoute()

const markedBalls = ref([])
const lastNumber = computed(() => {
  return markedBalls.value.length > 0 ? markedBalls.value[0] : ""
})

const getColumnLetter = (ballNumber) => {
  if (ballNumber >= 1 && ballNumber <= 15) return "b"
  if (ballNumber >= 16 && ballNumber <= 30) return "i"
  if (ballNumber >= 31 && ballNumber <= 45) return "n"
  if (ballNumber >= 46 && ballNumber <= 60) return "g"
  if (ballNumber >= 61 && ballNumber <= 75) return "o"
  return ""
}

const displayedNumbers = computed(() => {
  const result = { 1: "", 2: "", 3: "" }
  for (let i = 1; i <= 3; i++) {
    if (markedBalls.value.length > i) {
      result[i] = markedBalls.value[i]
    }
  }
  return result
})

const letters = ["B", "I", "N", "G", "O"]
const numbersPerColumn = 15
const tableroData = ref([])
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

<style scoped></style>
