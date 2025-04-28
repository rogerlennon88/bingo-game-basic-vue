<!-- src/components/modules/GameControls.vue -->

<template>
  <div id="game-controls" class="module">
    <ul class="game-controls-list">
      <li class="game-controls-item">
        <button id="btn-restart-game" class="btn btn-primary" type="button" title="Reiniciar Juego" @click="reiniciarJuegoConConfirmacion">
          <span class="material-icons-round"> history </span>
          <span class="btn-text">Limpiar Tablero</span>
        </button>
      </li>
      <li class="game-controls-item">
        <button id="btn-restart-mode" class="btn btn-primary" type="button" title="Reiniciar Modo" @click="reiniciarModoConConfirmacion">
          <span class="material-icons-round"> settings_backup_restore </span>
          <span class="btn-text">Limpiar Modo</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "GameControls",
  emits: ["reiniciar-juego", "reiniciar-modo"],
  setup(props, { emit }) {
    const reiniciarJuegoConConfirmacion = () => {
      if (window.confirm("¿Estás seguro de que quieres reiniciar el tablero? Esto borrará todas las balotas marcadas.")) {
        console.log("Confirmación de reinicio del tablero aceptada.")
        emit("reiniciar-juego")
      } else {
        console.log("Confirmación de reinicio del tablero cancelada.")
      }
    }

    const reiniciarModoConConfirmacion = () => {
      if (window.confirm("¿Estás seguro de que quieres reiniciar el modo de juego? Esto borrará el patrón seleccionado.")) {
        console.log("Confirmación de reinicio del modo aceptada.")
        emit("reiniciar-modo")
      } else {
        console.log("Confirmación de reinicio del modo cancelada.")
      }
    }

    return {
      reiniciarJuegoConConfirmacion,
      reiniciarModoConConfirmacion,
    }
  },
}
</script>

<style scoped>
/* game-controls */
#game-controls .game-controls-list {
  display: grid;
  gap: var(--gap);
  grid-auto-flow: column;
}
</style>
