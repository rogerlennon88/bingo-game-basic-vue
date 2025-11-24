<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="confirm-overlay">
      <div class="confirm-content">
        <div class="confirm-header">
          <span class="material-icons-round icon-warn">warning_amber</span>
          <h3>{{ title }}</h3>
        </div>
        <div class="confirm-body">
          <p>{{ message }}</p>
        </div>
        <div class="confirm-footer">
          <button class="btn btn-secondary" @click="$emit('cancel')">
            Cancelar
          </button>
          <button class="btn btn-primary" @click="$emit('confirm')">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: String,
  message: String
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.75); /* Un poco más oscuro */
  backdrop-filter: blur(4px);
  z-index: 2000; /* SUPERIOR al modal de revisión (que tiene 1000) */
  display: grid;
  place-items: center;
  padding: 20px;
}

.confirm-content {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  animation: bounceIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.confirm-header {
  background-color: #fff7ed; /* Fondo naranja muy claro para advertencia */
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ffedd5;
}

.icon-warn {
  color: #f97316; /* Naranja alerta */
  font-size: 2.8rem;
}

.confirm-header h3 {
  margin: 0;
  color: #9a3412;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: left;
}

.confirm-body {
  padding: 24px;
  color: #374151;
  font-size: 1.6rem;
  line-height: 1.5;
}

.confirm-footer {
  padding: 16px 24px;
  background-color: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Botones específicos del modal */
.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  font-size: 1.4rem;
}

.btn-secondary {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
}
.btn-secondary:hover {
  background-color: #f3f4f6;
}

.btn-primary {
  background-color: #dc2626; /* Rojo para acciones destructivas/importantes */
  color: white;
}
.btn-primary:hover {
  background-color: #b91c1c;
}

@keyframes bounceIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>