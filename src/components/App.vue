<!-- src/components/App.vue -->

<template>
  <div>
    <header>
      <section id="brand">
        <img class="logo" src="/public/img/logo.png" alt="Aladdingo Logo" />
      </section>
      <section id="page-title">
        <h1>Validador de Juego</h1>
      </section>
    </header>
    <main class="container game">
      <section class="block">
        <GameBoard @marcar-balota="handleMarcarBalota"></GameBoard>
      </section>
      <section class="block">
        <GameMode ref="gameModeRef" :initialPattern="loadedGamePattern"></GameMode>
        <LastNumber :markedBalls="balotasMarcadas"></LastNumber>
        <LastNumberList :markedBalls="balotasMarcadas"></LastNumberList>
      </section>
    </main>
  </div>
</template>

<script>
import GameBoard from "./modules/GameBoard.vue"
import LastNumber from "./modules/LastNumber.vue"
import LastNumberList from "./modules/LastNumberList.vue"
import GameMode from "./modules/GameMode.vue"
import { ref, onMounted } from "vue"

export default {
  name: "App",
  components: {
    GameBoard,
    LastNumber,
    LastNumberList,
    GameMode,
  },
  setup() {
    const balotasMarcadas = ref([])
    const loadedGamePattern = ref([])
    const gameModeRef = ref(null)

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

    const handleMarcarBalota = async (balota) => {
      const balotaString = String(balota)
      const isMarked = balotasMarcadas.value.includes(balotaString)
      if (!isMarked) {
        balotasMarcadas.value.unshift(balotaString)
      } else {
        const index = balotasMarcadas.value.indexOf(balotaString)
        if (index > -1) {
          balotasMarcadas.value.splice(index, 1)
        }
      }
      console.log(`Balota marcada en App.vue: ${balotaString}`)
      await guardarDatosGameBoard()
      await cargarDatosGameBoard()
    }

    onMounted(cargarDatosIniciales)

    return {
      balotasMarcadas,
      handleMarcarBalota,
      loadedGamePattern,
      gameModeRef,
    }
  },
}
</script>

<style scoped></style>
