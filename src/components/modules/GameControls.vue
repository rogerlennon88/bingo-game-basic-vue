<!-- src/components/modules/GameControls.vue -->

<template>
  <div id="game-controls" class="module">
    <ul class="game-controls-list">
      <li class="game-controls-item">
        <button
          id="btn-revision"
          class="btn btn-primary"
          type="button"
          title="Revisar Patrón"
          @click="$emit('abrir-revision')"
        >
          <span class="material-icons-round"> grid_view </span>
          <span class="btn-text">Revisión</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "GameControls",
  emits: ["abrir-revision"], 
  setup() {
    return {};
  },
}
</script>

<style scoped>
/* game-controls */
#game-controls {
  background-color: transparent;
  border: none;
  padding: 0;
}
#game-controls .game-controls-list {
  display: grid;
  gap: var(--gap);
  grid-auto-flow: column;
}
</style>
