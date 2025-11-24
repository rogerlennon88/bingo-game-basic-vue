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
import { ref } from "vue"
import GameBoard from "../components/modules/GameBoard.vue"
import LastNumber from "../components/modules/LastNumber.vue"
import LastNumberList from "../components/modules/LastNumberList.vue"
import GameMode from "../components/modules/GameMode.vue"
import Counter from "../components/modules/Counter.vue"
import GameControls from "../components/modules/GameControls.vue"
import ConfirmationModal from "../components/ConfirmationModal.vue"
import { useGameData } from "../composables/useGameData"

// --- USAR COMPOSABLE ---
const { markedBalls: balotasMarcadas, gamePattern: loadedGamePattern, fetchData: recargarDatos } = useGameData(1000)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""
const isModalOpen = ref(false)

// --- CONFIRMACIONES ---
const showConfirm = ref(false)
const confirmConfig = ref({ title: "", message: "", action: null })

const abrirConfirmacion = (titulo, mensaje, accion) => {
  confirmConfig.value = { title: titulo, message: mensaje, action: accion }
  showConfirm.value = true
}
const ejecutarAccionConfirmada = async () => {
  if (confirmConfig.value.action) await confirmConfig.value.action()
  showConfirm.value = false
}
const cancelarConfirmacion = () => {
  showConfirm.value = false
}

// --- SOLICITUDES ---
const solicitarReinicioJuego = () => {
  if (balotasMarcadas.value.length === 0) return
  abrirConfirmacion("¿Limpiar Tablero?", "Se borrarán las balotas marcadas.", handleReiniciarGameBoard)
}
const solicitarReinicioModo = () => {
  if (loadedGamePattern.value.length === 0) return
  abrirConfirmacion("¿Limpiar Patrón?", "Se borrará el patrón actual.", handleReiniciarGameMode)
}
const solicitarLlenarModo = (fullPattern) => {
  abrirConfirmacion("¿Llenar Patrón?", "Se seleccionarán todas las casillas.", () => handleLlenarGameMode(fullPattern))
}

const openModal = () => {
  isModalOpen.value = true
  document.body.style.overflow = "hidden"
}
const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = ""
}

// --- FETCH DE ESCRITURA ---
const guardarDatosGameBoard = async (datos) => {
  try {
    await fetch(`${API_BASE_URL}/api/game-board-data`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos || { markedBalls: balotasMarcadas.value }),
    })
  } catch (error) {
    console.error(error)
  }
}

const guardarDatosGameMode = async (datosAGuardar) => {
  try {
    await fetch(`${API_BASE_URL}/api/game-mode-data`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosAGuardar),
    })
  } catch (error) {
    console.error(error)
  }
}

// --- MANEJADORES ---
const handleMarcarBalota = async (balota) => {
  const balotaString = String(balota)
  if (!balotasMarcadas.value.includes(balotaString)) {
    const nuevoArray = [balotaString, ...balotasMarcadas.value]
    await guardarDatosGameBoard({ markedBalls: nuevoArray })
    await actualizarContador()
    await recargarDatos()
  }
}

const handleDesmarcarBalota = async (newMarkedBalls) => {
  await guardarDatosGameBoard({ markedBalls: newMarkedBalls })
  await disminuirContador()
  await recargarDatos()
}

const handleReiniciarGameBoard = async () => {
  await guardarDatosGameBoard({ markedBalls: [] })
  await resetearContador()
  await recargarDatos()
}

const handleReiniciarGameMode = async () => {
  await guardarDatosGameMode({ gamePattern: [] })
  await recargarDatos()
}

const handleLlenarGameMode = async (fullPattern) => {
  await guardarDatosGameMode({ gamePattern: fullPattern })
  await recargarDatos()
  // No necesitamos llamar a handlePatternChanged aquí porque el watch del hijo se encargará al recargar datos
}

// --- ¡ESTA ES LA CORRECCIÓN! ---
const handlePatternChanged = async (newPattern) => {
  loadedGamePattern.value = newPattern // Actualización visual inmediata
  await guardarDatosGameMode({ gamePattern: newPattern }) // Guardar en DB
  await recargarDatos() // Sincronizar
}

// --- CONTADORES ---
const disminuirContador = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/game-board-data/counter`, { method: "DELETE" })
  } catch (e) {}
}
const actualizarContador = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/game-board-data/counter`, { method: "PUT" })
  } catch (e) {}
}
const resetearContador = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/game-board-data/counter/reset`, { method: "PUT" })
  } catch (e) {}
}
</script>

<style scoped>
/* Tus estilos CSS se mantienen igual */
.counter-group-stack {
  display: grid;
  gap: var(--gap);
  justify-content: inherit;
}
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
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
