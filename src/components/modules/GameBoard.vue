<!-- src/components/modules/GameBoard.vue -->

<template>
  <div id="game-board" class="module">
    <div class="grid-container">
      <div id="grid-game-board" class="board-y">
        <div v-for="(column, columnIndex) in tableroData" :key="columnIndex" class="group">
          <div v-for="cell in column" :key="cell.id" class="cell">
            <button v-if="cell.type === 'letter'" :id="cell.id" class="btn-ggb letter lock">
              {{ cell.value }}
            </button>
            <button
              v-else-if="cell.type === 'number'"
              :id="cell.id"
              class="btn-ggb num"
              @click="marcarBalotaLocal(cell.value)"
              :class="{
                marked: isBalotaMarcada(cell.value),
                lock: isBalotaMarcada(cell.value) && !isLastMarked(cell.value),
              }"
            >
              {{ cell.value }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="game-board--control" class="module-controls">
      <ul class="game-controls-list">
        <li class="game-controls-item">
          <button
            id="btn-clear-board"
            class="btn btn-primary"
            type="button"
            title="Limpiar Tablero"
            @click="reiniciarJuegoConConfirmacionLocal"
            :class="{ lock: isClearBoardDisabled, disabled: isClearBoardDisabled }"
          >
            <span class="btn-text">Limpiar Tablero</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue"

export default {
  name: "GameBoard",
  emits: ["marcar-balota", "desmarcar-balota", "reiniciar-juego"],
  props: {
    initialMarkedBalls: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const letters = ["B", "I", "N", "G", "O"]
    const numbersPerColumn = 15
    const tableroData = ref([])
    const balotasMarcadasLocal = ref([...props.initialMarkedBalls])

    const generateTableroData = () => {
      const data = []
      for (let i = 0; i < 5; i++) {
        const column = []
        column.push({ type: "letter", value: letters[i], id: `${letters[i]}-ggb` })
        for (let j = 1; j <= numbersPerColumn; j++) {
          column.push({ type: "number", value: i * numbersPerColumn + j, id: i * numbersPerColumn + j })
        }
        data.push(column)
      }
      tableroData.value = data
    }

    const isBalotaMarcada = (balota) => {
      return balotasMarcadasLocal.value.includes(String(balota))
    }

    const isLastMarked = (balota) => {
      return balotasMarcadasLocal.value[0] === String(balota)
    }

    const API_BASE_URL = process.env.VITE_API_BASE_URL

    const marcarBalotaLocal = (balota) => {
      const balotaString = String(balota)
      const isMarked = isBalotaMarcada(balotaString)
      const isLast = isLastMarked(balotaString)

      if (isMarked) {
        if (isLast) {
          balotasMarcadasLocal.value.shift()

          emit("desmarcar-balota", balotasMarcadasLocal.value)
          console.log("Desmarcando balota:", balotaString, "Nuevas marcadas local:", balotasMarcadasLocal.value)
        } else {
          console.log("Balota ya marcada y bloqueada:", balotaString)
        }
      } else {
        balotasMarcadasLocal.value.unshift(balotaString)

        emit("marcar-balota", balotaString)
        console.log("Marcando balota:", balotaString, "Nuevas marcadas local:", balotasMarcadasLocal.value)
      }
    }

    const guardarDatosGameBoard = async (datosAGuardar) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/game-board-data`, {
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
        console.log("Datos del GameBoard guardados correctamente:", result.message)
      } catch (error) {
        console.error("Error al guardar los datos del GameBoard:", error)
      }
    }

    const cargarDatosInicialesGameBoard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/game-board-data`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        balotasMarcadasLocal.value = data.markedBalls || []
        console.log("Datos iniciales del GameBoard cargados:", balotasMarcadasLocal.value)
      } catch (error) {
        console.error("Error al cargar los datos iniciales del GameBoard:", error)
      } finally {
        generateTableroData()
      }
    }

    onMounted(cargarDatosInicialesGameBoard)

    // Watch para reaccionar a los cambios en la prop initialMarkedBalls
    watch(
      () => props.initialMarkedBalls,
      (newVal) => {
        console.log("Prop initialMarkedBalls ha cambiado:", newVal)
        balotasMarcadasLocal.value = [...newVal]
      },
      { deep: true }
    )

    const hasMarkedBallsLocal = computed(() => balotasMarcadasLocal.value.length > 0)
    const isClearBoardDisabled = computed(() => !hasMarkedBallsLocal.value)
    const reiniciarJuegoConConfirmacionLocal = () => {
      if (
        hasMarkedBallsLocal.value &&
        window.confirm("¿Estás seguro de que quieres limpiar el tablero? Esto borrará todas las balotas marcadas.")
      ) {
        console.log("Confirmación de reinicio del tablero (local) aceptada.")
        emit("reiniciar-juego")
      } else if (!hasMarkedBallsLocal.value) {
        console.log("No hay balotas marcadas para limpiar (local).")
      } else {
        console.log("Confirmación de reinicio del tablero (local) cancelada.")
      }
    }

    return {
      tableroData,
      marcarBalotaLocal,
      isBalotaMarcada,
      isLastMarked,
      balotasMarcadasLocal,
      isClearBoardDisabled,
      reiniciarJuegoConConfirmacionLocal,
    }
  },
}
</script>

<style scoped>
/* game-board */
#game-board {
  /* background-color: rgb(36, 113, 163); */
  border-radius: 4px;
  /* padding: 2px; */
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 2px;
  /* place-items: inherit; */
}

/* Grid Game Board */
#grid-game-board {
  background-color: #2471a3;
  padding: 2px;
  display: grid;
  gap: 2px;
  /* max-height: 80vh; */
  /* aspect-ratio: 7 / 16; */
}

/* Horizontal Grid */
#grid-game-board.board-x {
  grid-template-rows: repeat(5, 1fr);
}
#grid-game-board.board-x .group {
  grid-template-columns: repeat(16, 1fr);
}

/* Vertical Grid */
#grid-game-board.board-y {
  grid-template-columns: repeat(5, 1fr);
}
#grid-game-board.board-y .group {
  grid-template-rows: auto repeat(15, 1fr);
}

/* Groups and Cells */
#grid-game-board .group {
  display: grid;
  gap: 2px;
}
#grid-game-board .cell {
  display: grid;
}

/* General Buttons */
#grid-game-board .btn-ggb {
  color: white;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 2px;
  /* display: grid; */
  /* place-items: center; */
  cursor: pointer;
  user-select: none;
}

/* Letter Button */
#grid-game-board .letter {
  background-color: rgb(84, 153, 199);
  font-size: 2.4rem;
  font-weight: var(--fw-bold);
  aspect-ratio: inherit;
  padding: calc(var(--gap));
}

/* Number Button */
#grid-game-board .num {
  background-color: rgb(251, 252, 252);
  color: rgb(52, 73, 94);
  font-size: 4rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) / 2);
}

/* Letter Button Status */
#grid-game-board .letter:hover {
  background-color: rgb(137, 207, 240);
  color: rgb(0, 71, 171);
  text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.75);
}
#grid-game-board .letter:active {
  background-color: rgb(70, 130, 180);
  color: rgba(250, 249, 246, 0.32);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(8, 24, 168, 0.5);
}
#grid-game-board .letter.marked {
  background-color: rgb(70, 130, 180);
  color: rgba(250, 249, 246, 0.32);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  cursor: default;
  box-shadow: inset 0 0 8px 1px rgba(8, 24, 168, 0.5);
}

/* Number Button Status */
@media (hover: hover) {
  #grid-game-board .num:hover {
    background-color: rgb(255, 170, 51);
    color: var(--color-white);
  }
}
#grid-game-board .num:active {
  /* background-color: rgb(228, 155, 15); */
  /* color: rgb(243, 229, 171); */
  /* text-shadow: 2px 2px 3px rgba(139, 64, 0, 0.74); */
  /* box-shadow: inset 0 0 12px 2px rgba(139, 64, 0, 0.64); */
}
#grid-game-board .num.marked {
  background-color: rgb(193, 154, 107);
  color: rgba(250, 249, 246, 0.75);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  cursor: default;
  box-shadow: inset 0 0 8px 1px rgba(0, 0, 0, 0.5);
}

#game-board--control {
  background-color: rgba(237, 234, 222, 0.75);
  width: 100%;
  padding: var(--gap);
  border-radius: calc(var(--gap) / 2);
}
#game-board--control .game-controls-list {
  display: grid;
  gap: var(--gap, 8px); /* Asumiendo 8px si --gap no está definido */
  grid-auto-flow: column;
  justify-content: center; /* Centramos el botón */
}

/* Border Radius Grid Buttons */
#grid-game-board .group:first-child .cell:first-child .btn-ggb {
  border-top-left-radius: 2px;
}
#grid-game-board .group:first-child .cell:last-child .btn-ggb {
  border-bottom-left-radius: 2px;
}
#grid-game-board .group:last-child .cell:first-child .btn-ggb {
  border-top-right-radius: 2px;
}
#grid-game-board .group:last-child .cell:last-child .btn-ggb {
  border-bottom-right-radius: 2px;
}
</style>
