<!-- src/components/App.vue -->

<template>
  <div id="container-app" :class="appClass">
    <header v-if="$route.path === '/'">
      <section id="brand">
        <img class="logo" src="/public/img/logo.png" alt="Aladdingo Logo" />
      </section>
      <section id="page-title">
        <h1>Validador de Juego</h1>
      </section>
    </header>
    <main v-if="$route.path === '/'" class="container game">
      <router-view></router-view>
    </main>
    <router-view v-else></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router" // Importa useRoute
import GameBoard from "./modules/GameBoard.vue"
import LastNumber from "./modules/LastNumber.vue"
import LastNumberList from "./modules/LastNumberList.vue"
import GameMode from "./modules/GameMode.vue"
import GameControls from "./modules/GameControls.vue"

const route = useRoute() // Obtén la instancia de la ruta actual

const appClass = computed(() => {
  return route.path === "/" ? "home" : "view"
})

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
    console.log(`Balota marcada en App.vue: ${balotaString}`)
    await guardarDatosGameBoard();
    await cargarDatosGameBoard();
    await actualizarContador();
  }
};

const actualizarContador = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/game-board-data/counter", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("HTTP error! status: ${response.status}");
    }
    const result = await response.json();
    console.log("Contador actualizado correctamente:", result.message);
  } catch (error) {
    console.error("Error al actualizar el contador:", error);
  }
};

const handleReiniciarGameBoard = async () => {
  console.log("Manejando el evento de reiniciar tablero en App.vue...")
  balotasMarcadas.value = [] // Limpiar las balotas marcadas en el cliente
  await guardarDatosGameBoard({ markedBalls: [] }) // Limpiar en el backend
  await cargarDatosGameBoard() // Recargar el estado inicial del GameBoard
  await resetearContador()
}

const resetearContador = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/game-board-data/counter/reset", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("HTTP error! status: ${response.status}");
    }
    const result = await response.json();
    console.log("Contador reseteado correctamente:", result.message);
  } catch (error) {
    console.error("Error al resetear el contador:", error);
  }
};

const handleReiniciarGameMode = async () => {
  console.log("Manejando el evento de reiniciar modo en App.vue...")
  await guardarDatosGameMode({ gamePattern: [] }) // Limpiar el patrón en el backend
  await cargarGameModePattern() // Recargar el patrón inicial
}

const handlePatternChanged = (newPattern) => {
  markedPatternCount.value = newPattern.length
  console.log("Patrón cambiado en App.vue:", newPattern)
}

onMounted(cargarDatosIniciales)
</script>

<style scoped>
#container-app {
  width: 100vw;
  height: 100vh;
  display: grid;
}
#container-app.home {
  grid-template-rows: auto 1fr;
}
#container-app.view {
  padding: calc(var(--gap) * 2);
  place-items: baseline;
}
</style>
