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
    <div class="stack">
      <LastNumber :markedBalls="balotasMarcadas"></LastNumber>
      <LastNumberList :markedBalls="balotasMarcadas"></LastNumberList>

      <div class="counter-group-stack">
        <Counter />
        <GameControls @abrir-revision="openModal" />
      </div>
    </div>
  </section>

  <transition name="modal-anim">
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <header class="modal-header">
          <h3>Revisión de Patrón</h3>
          <button class="btn-close" @click="closeModal">
            <span class="material-icons-round">close</span>
          </button>
        </header>

        <div class="modal-body">
          <GameMode
            ref="gameModeRef"
            :initialPattern="loadedGamePattern"
            @pattern-changed="handlePatternChanged"
            @reiniciar-modo="handleReiniciarGameMode"
            @llenar-modo="handleLlenarGameMode"
          ></GameMode>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue"
import GameBoard from "../components/modules/GameBoard.vue"
import LastNumber from "../components/modules/LastNumber.vue"
import LastNumberList from "../components/modules/LastNumberList.vue"
import GameMode from "../components/modules/GameMode.vue"
import Counter from "../components/modules/Counter.vue"
import GameControls from "../components/modules/GameControls.vue"

const balotasMarcadas = ref([])
const loadedGamePattern = ref([])
const gameModeRef = ref(null)
const API_BASE_URL = process.env.VITE_API_BASE_URL

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
  document.body.style.overflow = "hidden"
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = ""
}

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
  console.log("Reiniciando modo desde modal...")
  await guardarDatosGameMode({ gamePattern: [] })
  await cargarGameModePattern()
}

const handleLlenarGameMode = async (fullPattern) => {
  console.log("Llenando modo desde modal...")
  loadedGamePattern.value = fullPattern
  await guardarDatosGameMode({ gamePattern: fullPattern })
  await cargarGameModePattern()
  handlePatternChanged(fullPattern)
}

const handlePatternChanged = (newPattern) => {
  console.log("Patrón cambiado:", newPattern)
}

onMounted(cargarDatosIniciales)
</script>

<style scoped>
/* Ajuste para el stack de controles */
.counter-group-stack {
  display: grid;
  gap: var(--gap);
  justify-content: center;
}

/* --- MODAL MODERNO --- */

/* 1. El Fondo (Overlay) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* Fondo oscuro con tinte azulado para modernidad */
  background-color: rgba(15, 23, 42, 0.65);
  /* Desenfoque fuerte para aislar el contenido (Glassmorphism) */
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px; /* Evita que toque los bordes en pantallas muy pequeñas */
}

/* 2. El Contenedor (La tarjeta) */
.modal-content {
  background-color: #ffffff; /* Blanco puro para máximo contraste */
  border-radius: 24px; /* Bordes muy redondeados */
  /* Sombra profunda para efecto de elevación "flotante" */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  aspect-ratio: 3 / 4;
  /* width: 100%; */
  width: 100%;
  /* max-width: 80%; */
  max-width: 75%;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden; /* Para que los hijos no se salgan del borde redondeado */
  position: relative;
}

/* 3. El Encabezado */
.modal-header {
  background-color: #f8fafc; /* Gris muy sutil para diferenciar el header */
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b; /* Texto oscuro, casi negro */
  font-family: "Play", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

/* 4. Botón de Cerrar */
.btn-close {
  background: #eff6ff;
  border: none;
  cursor: pointer;
  color: #3b82f6; /* Color primario */
  width: 36px;
  height: 36px;
  border-radius: 50%; /* Totalmente redondo */
  display: grid;
  place-items: center;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background-color: #3b82f6;
  color: white;
  transform: rotate(90deg); /* Pequeño giro al pasar el mouse */
}

/* 5. El Cuerpo (Donde va el GameMode) */
.modal-body {
  padding: 32px;
  background-color: white;
  display: grid;
}

/* --- ANIMACIONES (Zoom In / Fade) --- */

.modal-anim-enter-active,
.modal-anim-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* Efecto rebote suave */
}

.modal-anim-enter-from,
.modal-anim-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px); /* Empieza pequeño y un poco abajo */
}

.modal-anim-enter-to,
.modal-anim-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.modal-body :deep(.module) {
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}
</style>
