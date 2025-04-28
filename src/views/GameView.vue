<!-- src/views/GameView.vue -->
<template>
  <section class="block">
    <GameBoard @marcar-balota="handleMarcarBalota" :initialMarkedBalls="balotasMarcadas"></GameBoard>
  </section>
  <section class="block">
    <GameMode ref="gameModeRef" :initialPattern="loadedGamePattern" @pattern-changed="handlePatternChanged"></GameMode>
    <LastNumber :markedBalls="balotasMarcadas"></LastNumber>
    <LastNumberList :markedBalls="balotasMarcadas"></LastNumberList>
    <GameControls
      @reiniciar-juego="handleReiniciarGameBoard"
      @reiniciar-modo="handleReiniciarGameMode"
      :hasMarkedBalls="hasMarkedBalls"
      :markedPatternCount="markedPatternCount"
    ></GameControls>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import GameBoard from "../components/modules/GameBoard.vue"
import LastNumber from "../components/modules/LastNumber.vue"
import LastNumberList from "../components/modules/LastNumberList.vue"
import GameMode from "../components/modules/GameMode.vue"
import GameControls from "../components/modules/GameControls.vue"

const balotasMarcadas = ref([])
const loadedGamePattern = ref([])
const gameModeRef = ref(null)
const markedPatternCount = ref(0)
const hasMarkedBalls = computed(() => balotasMarcadas.value.length > 0)

const cargarDatosGameBoard = async () => {
  console.log("Cargando datos del GameBoard desde el backend...")
  try {
    const response = await fetch("http://localhost:3000/api/game-board-data")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    balotasMarcadas.value = data.markedBalls || []
  } catch (error) {
    console.error("Error al cargar los datos del GameBoard:", error)
  }
}

const cargarGameModePattern = async () => {
  console.log("Intentando cargar el patrón del GameMode desde el backend...")
  try {
    const response = await fetch("http://localhost:3000/api/game-mode-data")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    loadedGamePattern.value = data.gamePattern || []
    markedPatternCount.value = data.gamePattern ? data.gamePattern.length : 0 // Inicializar el contador
  } catch (error) {
    console.error("Error al cargar el patrón del GameMode:", error)
  }
}

const cargarDatosIniciales = async () => {
  await cargarDatosGameBoard()
  await cargarGameModePattern()
}

const guardarDatosGameBoard = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/game-board-data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        markedBalls: balotasMarcadas.value,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    console.log("Datos del GameBoard guardados correctamente:", result.message)
  } catch (error) {
    console.error("Error al guardar los datos del GameBoard:", error)
  }
}

const guardarDatosGameMode = async (datosAGuardar) => {
  try {
    const response = await fetch("http://localhost:3000/api/game-mode-data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosAGuardar),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    console.log("Datos del modo de juego guardados correctamente:", result.message)
  } catch (error) {
    console.error("Error al guardar los datos del modo de juego:", error)
  }
}

const handleMarcarBalota = async (balota) => {
  const balotaString = String(balota)
  const isMarked = balotasMarcadas.value.includes(balotaString)
  if (!isMarked) {
    balotasMarcadas.value.unshift(balotaString)
    console.log(`Balota marcada en GameView.vue: ${balotaString}`)
    await guardarDatosGameBoard()
    await cargarDatosGameBoard()
  }
}

const handleReiniciarGameBoard = async () => {
  console.log("Manejando el evento de reiniciar tablero en GameView.vue...")
  balotasMarcadas.value = [] // Limpiar las balotas marcadas en el cliente
  await guardarDatosGameBoard({ markedBalls: [] }) // Limpiar en el backend
  await cargarDatosGameBoard() // Recargar el estado inicial del GameBoard
}

const handleReiniciarGameMode = async () => {
  console.log("Manejando el evento de reiniciar modo en GameView.vue...")
  await guardarDatosGameMode({ gamePattern: [] }) // Limpiar el patrón en el backend
  await cargarGameModePattern() // Recargar el patrón inicial
}

const handlePatternChanged = (newPattern) => {
  markedPatternCount.value = newPattern.length
  console.log("Patrón cambiado en GameView.vue:", newPattern)
}

onMounted(cargarDatosIniciales)
</script>

<style scoped></style>
