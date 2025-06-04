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
          <div class="score--body"></div>
        </div>
      </section>
    </section>
    <section id="main-obs-fullhd--prize-info">
      <div class="prize-info">
        <h3 class="prize-info--title">Premio:</h3>
        <div class="prize-info--description">$10.000.000</div>
      </div>
    </section>
    <section id="main-obs-fullhd--game-mode">
      <div class="game-mode">game-mode</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useRoute } from "vue-router"
import "../assets/view-styles/main-obs-fullhd/main.css"

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
</style>
