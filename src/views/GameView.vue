// src/views/GameView.vue

<template>
  <section class="block">
    <GameBoard
      @marcar-balota="handleMarcarBalota"
      @reiniciar-juego="handleReiniciarGameBoard"
      @desmarcar-balota="handleDesmarcarBalota"
      :initialMarkedBalls="balotasMarcadas"
    ></GameBoard>
  </section>
  <section class="block">
    <GameMode
      ref="gameModeRef"
      :initialPattern="loadedGamePattern"
      @pattern-changed="handlePatternChanged"
      @reiniciar-modo="handleReiniciarGameMode"
      @llenar-modo="handleLlenarGameMode"
    ></GameMode>
    <div class="stack">
      <LastNumber :markedBalls="balotasMarcadas"></LastNumber>
      <Counter />
    </div>
    <LastNumberList :markedBalls="balotasMarcadas"></LastNumberList>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import GameBoard from "../components/modules/GameBoard.vue"
import LastNumber from "../components/modules/LastNumber.vue"
import LastNumberList from "../components/modules/LastNumberList.vue"
import GameMode from "../components/modules/GameMode.vue"
import Counter from "../components/modules/Counter.vue"

const balotasMarcadas = ref([])
const loadedGamePattern = ref([])
const gameModeRef = ref(null)

const API_BASE_URL = process.env.VITE_API_BASE_URL

const cargarDatosGameBoard = async () => {
  console.log("Cargando datos del GameBoard desde el backend...")
  try {
    const response = await fetch(`${API_BASE_URL}/api/game-board-data`)
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
    const response = await fetch(`${API_BASE_URL}/api/game-mode-data`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    loadedGamePattern.value = data.gamePattern || []
  } catch (error) {
    console.error("Error al cargar el patrón del GameMode:", error)
  }
}

const cargarDatosIniciales = async () => {
  await cargarDatosGameBoard()
  await cargarGameModePattern()
}

const guardarDatosGameBoard = async (datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game-board-data`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos || { markedBalls: balotasMarcadas.value }),
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
    const response = await fetch(`${API_BASE_URL}/api/game-mode-data`, {
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
    await actualizarContador()
  }
}

const handleDesmarcarBalota = async (newMarkedBalls) => {
  console.log(`Balotas desmarcadas. Nuevo array: ${newMarkedBalls}`)
  await guardarDatosGameBoard({ markedBalls: newMarkedBalls }) 
  await disminuirContador()
  await cargarDatosGameBoard() 
}

const disminuirContador = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game-board-data/counter`, {
      method: "DELETE", // Usamos DELETE para la operación de disminuir/descontar
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    console.log("Contador disminuido correctamente:", result.message)
  } catch (error) {
    console.error("Error al disminuir el contador:", error)
  }
}

const actualizarContador = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game-board-data/counter`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    console.log("Contador actualizado correctamente:", result.message)
  } catch (error) {
    console.error("Error al actualizar el contador:", error)
  }
}

const handleReiniciarGameBoard = async () => {
  console.log("Manejando el evento de reiniciar tablero en GameView.vue...")
  balotasMarcadas.value = []
  await guardarDatosGameBoard({ markedBalls: [] })
  await cargarDatosGameBoard()
  await resetearContador()
}

const resetearContador = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game-board-data/counter/reset`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    console.log("Contador reseteado correctamente:", result.message)
  } catch (error) {
    console.error("Error al resetear el contador:", error)
  }
}

const handleReiniciarGameMode = async () => {
  console.log("Manejando el evento de reiniciar modo en GameView.vue...")
  await guardarDatosGameMode({ gamePattern: [] })
  await cargarGameModePattern()
}

const handleLlenarGameMode = async (fullPattern) => {
  console.log("Manejando el evento de llenar modo en GameView.vue...")
  loadedGamePattern.value = fullPattern
  await guardarDatosGameMode({ gamePattern: fullPattern })
  await cargarGameModePattern()
  handlePatternChanged(fullPattern)
}

const handlePatternChanged = (newPattern) => {
  console.log("Patrón cambiado en GameView.vue:", newPattern)
}

onMounted(cargarDatosIniciales)
</script>

<style scoped></style>
