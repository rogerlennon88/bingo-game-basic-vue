<template>
  <section class="block">
    <GameBoard
      @marcar-balota="handleMarcarBalota"
      @reiniciar-juego="solicitarReinicioJuego"
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
            @reiniciar-modo="solicitarReinicioModo"
            @llenar-modo="solicitarLlenarModo"
          ></GameMode>
        </div>
      </div>
    </div>
  </transition>

  <ConfirmationModal
    :isOpen="showConfirm"
    :title="confirmConfig.title"
    :message="confirmConfig.message"
    @confirm="ejecutarAccionConfirmada"
    @cancel="cancelarConfirmacion"
  />
</template>

<script setup>
import { ref } from "vue" // Quitamos onMounted, ya no es necesario para carga inicial
import GameBoard from "../components/modules/GameBoard.vue"
import LastNumber from "../components/modules/LastNumber.vue"
import LastNumberList from "../components/modules/LastNumberList.vue"
import GameMode from "../components/modules/GameMode.vue"
import Counter from "../components/modules/Counter.vue"
import GameControls from "../components/modules/GameControls.vue"
import ConfirmationModal from "../components/ConfirmationModal.vue"
import { useGameData } from "../composables/useGameData" // 1. IMPORTAR COMPOSABLE

// 2. USAR COMPOSABLE
// Renombramos las variables para que coincidan con tu template existente
const {
  markedBalls: balotasMarcadas,
  gamePattern: loadedGamePattern,
  fetchData: recargarDatos, // Usamos esto para refrescar después de guardar
} = useGameData(1000) // Polling cada 1 segundo

const gameModeRef = ref(null)
const API_BASE_URL = process.env.VITE_API_BASE_URL
const isModalOpen = ref(false)

// --- LÓGICA DEL SISTEMA DE CONFIRMACIÓN (Intacta) ---
const showConfirm = ref(false)
const confirmConfig = ref({
  title: "",
  message: "",
  action: null,
})

const abrirConfirmacion = (titulo, mensaje, accion) => {
  confirmConfig.value = { title: titulo, message: mensaje, action: accion }
  showConfirm.value = true
}

const ejecutarAccionConfirmada = async () => {
  if (confirmConfig.value.action) {
    await confirmConfig.value.action()
  }
  showConfirm.value = false
}

const cancelarConfirmacion = () => {
  showConfirm.value = false
}

// --- SOLICITUDES DESDE LOS HIJOS (Intacta) ---
const solicitarReinicioJuego = () => {
  if (balotasMarcadas.value.length === 0) return
  abrirConfirmacion(
    "¿Limpiar Tablero?",
    "Estás a punto de borrar todas las balotas marcadas. Esta acción no se puede deshacer.",
    handleReiniciarGameBoard
  )
}

const solicitarReinicioModo = () => {
  if (loadedGamePattern.value.length === 0) return
  abrirConfirmacion("¿Limpiar Patrón?", "Esto borrará el patrón de juego actual.", handleReiniciarGameMode)
}

const solicitarLlenarModo = (fullPattern) => {
  abrirConfirmacion("¿Llenar Patrón?", "Esto seleccionará todas las casillas del patrón.", () => handleLlenarGameMode(fullPattern))
}

// --- MODAL ---
const openModal = () => {
  isModalOpen.value = true
  document.body.style.overflow = "hidden"
}
const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = ""
}

// --- FUNCIONES DE ESCRITURA (GUARDAR) ---
// Estas funciones se mantienen porque el composable solo lee.
// Pero eliminamos los fetchs de lectura (cargarDatos...) y usamos recargarDatos()

const guardarDatosGameBoard = async (datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game-board-data`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos || { markedBalls: balotasMarcadas.value }),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    // No necesitamos loguear cada éxito
  } catch (error) {
    console.error("Error al guardar los datos del GameBoard:", error)
  }
}

const guardarDatosGameMode = async (datosAGuardar) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game-mode-data`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosAGuardar),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  } catch (error) {
    console.error("Error al guardar los datos del modo de juego:", error)
  }
}

// --- MANEJADORES DE ACCIONES ---

const handleMarcarBalota = async (balota) => {
  const balotaString = String(balota)
  const isMarked = balotasMarcadas.value.includes(balotaString)
  if (!isMarked) {
    // Actualización optimista local (opcional, el composable lo haría en 1s, pero así es inmediato)
    // balotasMarcadas.value.unshift(balotaString) -> El composable es readonly por defecto, mejor esperar o forzar recarga

    // Primero guardamos en DB
    // NOTA: Para enviar el nuevo array al backend necesitamos construirlo,
    // ya que balotasMarcadas viene del composable y podría ser inmutable o sobrescrito pronto.
    const nuevoArray = [balotaString, ...balotasMarcadas.value]

    await guardarDatosGameBoard({ markedBalls: nuevoArray })
    await actualizarContador()
    await recargarDatos() // Forzamos actualización inmediata
  }
}

const handleDesmarcarBalota = async (newMarkedBalls) => {
  await guardarDatosGameBoard({ markedBalls: newMarkedBalls })
  await disminuirContador()
  await recargarDatos()
}

const handleReiniciarGameBoard = async () => {
  console.log("Reiniciando tablero...")
  await guardarDatosGameBoard({ markedBalls: [] })
  await resetearContador()
  await recargarDatos()
}

const handleReiniciarGameMode = async () => {
  console.log("Reiniciando modo...")
  await guardarDatosGameMode({ gamePattern: [] })
  await recargarDatos()
}

const handleLlenarGameMode = async (fullPattern) => {
  console.log("Llenando modo...")
  await guardarDatosGameMode({ gamePattern: fullPattern })
  await recargarDatos()
  handlePatternChanged(fullPattern)
}

// --- CONTADORES ---
const disminuirContador = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/game-board-data/counter`, { method: "DELETE", headers: { "Content-Type": "application/json" } })
  } catch (error) {
    console.error(error)
  }
}
const actualizarContador = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/game-board-data/counter`, { method: "PUT", headers: { "Content-Type": "application/json" } })
  } catch (error) {
    console.error(error)
  }
}
const resetearContador = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/game-board-data/counter/reset`, { method: "PUT", headers: { "Content-Type": "application/json" } })
  } catch (error) {
    console.error(error)
  }
}

const handlePatternChanged = (newPattern) => {
  console.log("Patrón cambiado:", newPattern)
}
</script>

<style scoped>
/* Ajuste para el stack de controles */
.counter-group-stack {
  display: grid;
  gap: var(--gap);
  justify-content: center;
}

/* --- MODAL MODERNO --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  aspect-ratio: 3 / 4;
  width: 100%;
  max-width: 75%;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  position: relative;
}

.modal-header {
  background-color: #f8fafc;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-family: "Play", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.btn-close {
  background: #eff6ff;
  border: none;
  cursor: pointer;
  color: #3b82f6;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background-color: #3b82f6;
  color: white;
  transform: rotate(90deg);
}

.modal-body {
  padding: 32px;
  background-color: white;
  display: grid;
}

.modal-anim-enter-active,
.modal-anim-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-anim-enter-from,
.modal-anim-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
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
