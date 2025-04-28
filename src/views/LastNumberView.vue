<template>
  <div id="last-number-view">
    <span id="num-1" class="ball">{{ lastNumber }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const lastNumber = ref("-")

async function fetchLastNumber() {
  try {
    const response = await fetch("http://localhost:3000/api/game-board-data")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    const markedBalls = data.markedBalls || []
    lastNumber.value = markedBalls.length > 0 ? markedBalls[0] : ""
  } catch (error) {
    console.error("Error al obtener los datos:", error)
    lastNumber.value = "Error al cargar"
  }
}

onMounted(() => {
  fetchLastNumber()
  setInterval(fetchLastNumber, 1000) // Actualizar cada 1 segundo
})
</script>

<style scoped>
/* last-number-view */
#last-number-view {
  padding: 2vw;
  aspect-ratio: 1 / 1;
}
#last-number-view #num-1 {
  background-color: white;
  color: rgb(25, 25, 112);
  font-size: 48vw;
  font-weight: var(--fw-bold);
  padding: 1vw;
  border: 3vw solid rgba(233, 220, 201, 0.75);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ball {
  min-width: 128px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
