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
            @click="$emit('reiniciar-juego')"
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
import { ref, onMounted, computed } from "vue"

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

    // Generar estructura visual (Esto es estático, se queda)
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

    // Usamos las props directamente (Reactividad automática)
    const isBalotaMarcada = (balota) => props.initialMarkedBalls.includes(String(balota))

    const isLastMarked = (balota) => {
      return props.initialMarkedBalls.length > 0 && props.initialMarkedBalls[0] === String(balota)
    }

    const marcarBalotaLocal = (balota) => {
      const balotaString = String(balota)
      const isMarked = isBalotaMarcada(balotaString)
      const isLast = isLastMarked(balotaString)

      if (isMarked) {
        if (isLast) {
          // Lógica de desmarcar: calculamos el nuevo array y lo enviamos al padre
          const newArray = props.initialMarkedBalls.slice(1) // Quitamos el primero
          emit("desmarcar-balota", newArray)
        }
      } else {
        emit("marcar-balota", balotaString)
      }
    }

    const isClearBoardDisabled = computed(() => props.initialMarkedBalls.length === 0)

    onMounted(() => {
      generateTableroData()
      // ¡AQUÍ BORRAMOS TODAS LAS CARGAS DE DATOS!
    })

    return {
      tableroData,
      marcarBalotaLocal,
      isBalotaMarcada,
      isLastMarked,
      isClearBoardDisabled,
    }
  },
}
</script>

<style scoped>
/* Tus estilos CSS se mantienen igual */
#game-board {
  border-radius: 4px;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 2px;
}
#grid-game-board {
  background-color: #2471a3;
  padding: 2px;
  display: grid;
  gap: 2px;
}
#grid-game-board.board-y {
  grid-template-columns: repeat(5, 1fr);
}
#grid-game-board.board-y .group {
  grid-template-rows: auto repeat(15, 1fr);
}
#grid-game-board .group {
  display: grid;
  gap: 2px;
}
#grid-game-board .cell {
  display: grid;
}
#grid-game-board .btn-ggb {
  color: white;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
}
#grid-game-board .letter {
  background-color: rgb(84, 153, 199);
  font-size: 2.4rem;
  font-weight: var(--fw-bold);
  aspect-ratio: inherit;
  padding: calc(var(--gap));
}
#grid-game-board .num {
  background-color: rgb(251, 252, 252);
  color: rgb(52, 73, 94);
  font-size: 4rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) / 2);
}
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
@media (hover: hover) {
  #grid-game-board .num:hover {
    background-color: rgb(255, 170, 51);
    color: var(--color-white);
  }
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
  gap: var(--gap, 8px);
  grid-auto-flow: column;
  justify-content: center;
}
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
