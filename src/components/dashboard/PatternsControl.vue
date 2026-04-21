<template>
  <div id="patterns-control" class="module">
    <h2 class="title-2">Patrones</h2>
    <div class="patterns-grid">
      <button
        v-for="pattern in patternsList"
        :key="pattern.id"
        class="pattern-btn"
        :class="{ 'is-completed': pattern.completed }"
        @click="togglePattern(pattern.id)"
        :title="pattern.name"
      >
        <div class="icon-wrapper">
          <img :src="pattern.icon" :alt="pattern.name" class="pattern-icon" />
          <div v-if="pattern.completed" class="check-overlay">
            <span class="material-icons-round">check_circle</span>
          </div>
        </div>
        <span class="pattern-name">{{ pattern.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()

const patternsList = computed(() => store.config.patterns || [])

const togglePattern = (id) => {
  // Creamos un nuevo array mapeando los patrones para cambiar el estado del seleccionado
  const updatedPatterns = patternsList.value.map((pattern) => (pattern.id === id ? { ...pattern, completed: !pattern.completed } : pattern))
  // Enviamos al servidor a través de Pinia
  store.updateConfig({ patterns: updatedPatterns })
}
</script>

<style scoped>
/* Pega aquí exactamente los mismos estilos de tu PatternsControl.vue original */
#patterns-control {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  padding: var(--gap);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}
.patterns-grid {
  display: grid;
  gap: 12px;
}
.pattern-btn {
  background: white;
  border: 3px solid transparent;
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.pattern-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.pattern-btn {
  border-color: #e2e8f0;
}
.pattern-btn.is-completed {
  border-color: #22c55e;
  background-color: #f0fdf4;
}
.icon-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
}
.pattern-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: filter 0.3s;
}
.pattern-btn.is-completed .pattern-icon {
  filter: grayscale(100%) opacity(0.7);
}
.check-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #22c55e;
  background: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.check-overlay span {
  font-size: 3rem;
}
.pattern-name {
  margin-top: 8px;
  font-size: 1.4rem;
  font-weight: bold;
  color: #475569;
}
</style>
