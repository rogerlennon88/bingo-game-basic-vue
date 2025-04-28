<template>
  <ul id="last-number-list-view" :class="directionClass">
    <li class="item" v-for="i in 4" :key="i">
      <span class="ball">{{ displayedNumbers[i] || "" }}</span>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router" // Importa useRoute

const route = useRoute() // Obtén el objeto de la ruta actual
const markedBalls = ref([])

const direction = computed(() => route.params.direction) // Obtén el parámetro 'direction'
const directionClass = computed(() => {
  if (direction.value === "y") {
    return "dir-y"
  } else {
    return "dir-x" // Clase por defecto
  }
})

const displayedNumbers = computed(() => {
  const result = { 1: "", 2: "", 3: "", 4: "" }
  for (let i = 1; i <= 4; i++) {
    if (markedBalls.value.length > i) {
      result[i] = markedBalls.value[i]
    }
  }
  return result
})

async function fetchMarkedBalls() {
  try {
    const response = await fetch("http://localhost:3000/api/game-board-data")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    markedBalls.value = data.markedBalls || []
  } catch (error) {
    console.error("Error al obtener los datos:", error)
    markedBalls.value = [] // En caso de error, mostrar lista vacía
  }
}

onMounted(() => {
  fetchMarkedBalls()
  setInterval(fetchMarkedBalls, 1000) // Actualizar cada 1 segundo
})
</script>

<style scoped>
/* last-number-list-view */
#last-number-list-view {
  display: grid;
}
.dir-x {
  margin: 2vw;
  grid-auto-flow: column;
  gap: 2vw;
}
.dir-y {
  margin: 2vw;
  grid-auto-flow: row;
  gap: 2vw;
}
.ball {
  background-color: white;
  color: rgb(25, 25, 112);
  font-weight: var(--fw-bold);
  border-style: solid;
  border-color: rgba(233, 220, 201, 0.75);
  border-radius: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dir-x .item .ball {
  font-size: 12vw;
  border-width: 1vw;
}
.dir-y .item .ball {
  font-size: 54vw;
  border-width: 4vw;
}
</style>
