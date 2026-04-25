<template>
  <div class="dashboard-wrapper">
    <section class="block block-board">
      <GameBoard />
    </section>

    <section class="block block-history">
      <div class="stack">
        <BallHistory />
        <Counter />
      </div>
    </section>

    <section class="block block-controls">
      <GameControls @abrir-revision="openModal" />
      <PatternsControl />
    </section>

    <transition name="modal-anim">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <header class="modal-header">
            <h3>Revisión de Patrón</h3>
            <button class="btn-close" @click="closeModal" title="Cerrar">
              <span class="material-icons-round">close</span>
            </button>
          </header>
          <div class="modal-body">
            <GameMode />
          </div>
        </div>
      </div>
    </transition>

    <div :class="['connection-badge', isConnected ? 'online' : 'offline']">
      <span class="material-icons-round badge-icon">
        {{ isConnected ? "wifi" : "wifi_off" }}
      </span>
      <span>{{ isConnected ? "En Línea" : "Desconectado" }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useAppStore } from "../stores/appStore"

// Importación de nuestros nuevos widgets/paneles interactivos
import GameBoard from "../components/dashboard/GameBoard.vue"
import BallHistory from "../components/dashboard/BallHistory.vue" // <--- NUEVA IMPORTACIÓN
import Counter from "../components/dashboard/Counter.vue"
import GameControls from "../components/dashboard/GameControls.vue"
import PatternsControl from "../components/dashboard/PatternsControl.vue"
import GameMode from "../components/dashboard/GameMode.vue"

const store = useAppStore()

// Estado de conexión para el Badge
const isConnected = computed(() => store.isConnected)

// Control del Modal
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
  document.body.style.overflow = "hidden"
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = ""
}

// Arrancar conexión al montar la vista
onMounted(() => {
  if (!store.socket) {
    store.initSocket()
  }
})
</script>

<style scoped>
/* Estructura Grid basada en tu _game.css original
  Adaptado para funcionar dentro del <router-view> sin romper App.vue 
*/
.dashboard-wrapper {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr auto;
  gap: var(--gap);
  width: 100%;
  height: 100%;
}

.block-board {
  order: 2;
  grid-row: 2 / 1 span;
  grid-column: 1 / auto;
}

.block-history {
  order: 1;
  grid-row: 1 / auto;
  grid-column: 1 / 2 span;
}

.block-controls {
  order: 3;
  grid-row: 2 / 1 span;
  grid-column: 2 / auto;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

/* Estilos del Modal (Mantenidos de tu original) */
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

/* Badge de Conexión */
.connection-badge {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.4rem;
  font-weight: var(--fw-bold);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 500;
  transition: background-color 0.3s;
}
.connection-badge.online {
  background-color: #22c55e;
  color: white;
}
.connection-badge.offline {
  background-color: #ef4444;
  color: white;
}
.badge-icon {
  font-size: 1.8rem;
}
</style>
