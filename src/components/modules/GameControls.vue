<!-- src/components/modules/GameControls.vue -->

<template>
  <div id="game-controls" class="module">
    <ul class="game-controls-list">
      <li class="game-controls-item">
        <button
          id="btn-restart-game"
          class="btn btn-primary"
          type="button"
          title="Limpiar Tablero"
          @click="reiniciarJuegoConConfirmacion"
          :class="{ lock: isRestartGameLocked, disabled: isRestartGameDisabled }"
        >
          <!-- <span class="material-icons-round"> history </span> -->
          <span class="btn-text">Limpiar Tablero</span>
        </button>
      </li>
      <li class="game-controls-item">
        <button
          id="btn-restart-mode"
          class="btn btn-primary"
          type="button"
          title="Reiniciar Modo"
          @click="reiniciarModoConConfirmacion"
          :class="{ lock: isRestartModeLocked, disabled: isRestartModeDisabled }"
        >
          <!-- <span class="material-icons-round"> settings_backup_restore </span> -->
          <span class="btn-text">Limpiar Modo</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from "vue"

export default {
  name: "GameControls",
  emits: ["reiniciar-juego", "reiniciar-modo"],
  props: {
    hasMarkedBalls: {
      type: Boolean,
      default: false,
    },
    markedPatternCount: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const isRestartGameLocked = computed(() => !props.hasMarkedBalls)
    const isRestartGameDisabled = computed(() => !props.hasMarkedBalls)

    const isRestartModeLocked = computed(() => props.markedPatternCount < 4)
    const isRestartModeDisabled = computed(() => props.markedPatternCount < 4)

    const reiniciarJuegoConConfirmacion = () => {
      if (
        props.hasMarkedBalls &&
        window.confirm("¿Estás seguro de que quieres limpiar el tablero? Esto borrará todas las balotas marcadas.")
      ) {
        console.log("Confirmación de reinicio del tablero aceptada.")
        emit("reiniciar-juego")
      } else if (!props.hasMarkedBalls) {
        console.log("No hay balotas marcadas para limpiar.")
      } else {
        console.log("Confirmación de reinicio del tablero cancelada.")
      }
    }

    const reiniciarModoConConfirmacion = () => {
      if (
        props.markedPatternCount >= 4 &&
        window.confirm("¿Estás seguro de que quieres limpiar el modo de juego? Esto borrará el patrón seleccionado.")
      ) {
        console.log("Confirmación de reinicio del modo aceptada.")
        emit("reiniciar-modo")
      } else if (props.markedPatternCount < 4) {
        console.log("No se han marcado suficientes posiciones del patrón para limpiar.")
      } else {
        console.log("Confirmación de reinicio del modo cancelada.")
      }
    }

    return {
      isRestartGameLocked,
      isRestartGameDisabled,
      isRestartModeLocked,
      isRestartModeDisabled,
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
