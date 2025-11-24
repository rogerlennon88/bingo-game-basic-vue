<template>
  <div id="game-mode" class="module">
    <h2 class="title-2">Modo de Juego</h2>
    <div class="layout-mode">
      <div id="grid-game-mode" class="grid-game-mode">
        <div v-for="(column, columnIndex) in gameModeData" :key="columnIndex" class="group">
          <div v-for="cell in column" :key="cell.id" class="cell">
            <button
              :id="cell.id"
              class="btn-ggm"
              :class="{
                letter: cell.type === 'letter',
                num: cell.type === 'number' && !cell.isMiddle,
                middle: cell.isMiddle,
                lock: cell.type === 'letter' || cell.isMiddle,
                marked: selectedPattern.includes(cell.id),
              }"
              @click="cell.type === 'number' && togglePattern(cell.id)"
            >
              {{ cell.value }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="game-mode--control" class="module-controls">
      <ul class="game-controls-list">
        <li class="game-controls-item">
          <button
            id="btn-clear-mode"
            class="btn btn-primary"
            type="button"
            title="Limpiar Patrón de Juego"
            @click="reiniciarModoConConfirmacionLocal"
            :class="{ lock: isClearModeDisabled, disabled: isClearModeDisabled }"
          >
            <span class="btn-text">Limpiar Patrón</span>
          </button>
        </li>
        <li class="game-controls-item">
          <button
            id="btn-fill-mode"
            class="btn btn-primary"
            type="button"
            title="Llenar Patrón de Juego Completo"
            @click="llenarModoConConfirmacionLocal"
            :class="{ lock: isFillModeDisabled, disabled: isFillModeDisabled }"
          >
            <span class="btn-text">Llenar Patrón</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from "vue"

const FULL_PATTERN = [
  "b1", "b2", "b3", "b4", "b5",
  "i1", "i2", "i3", "i4", "i5",
  "n1", "n2", "n4", "n5", 
  "g1", "g2", "g3", "g4", "g5",
  "o1", "o2", "o3", "o4", "o5"
]

export default {
  name: "GameMode",
  emits: ["pattern-changed", "reiniciar-modo", "llenar-modo"],
  props: {
    initialPattern: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const letters = ["B", "I", "N", "G", "O"]
    const rows = 5
    const gameModeData = ref([])
    const selectedPattern = ref([...props.initialPattern])

    const generateGameModeData = () => {
      const data = []
      letters.forEach((letter, columnIndex) => {
        const column = []
        column.push({ type: "letter", value: letter, id: `${letter.toLowerCase()}-ggm` })
        for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {
          const id = `${letter.toLowerCase()}${rowIndex}`
          column.push({ type: "number", value: id, id: id, isMiddle: letter === "N" && rowIndex === 3 })
        }
        data.push(column)
      })
      gameModeData.value = data
    }

    const togglePattern = (positionId) => {
      const button = document.getElementById(positionId)
      if (button) {
        button.classList.toggle("marked")
        const isMarked = button.classList.contains("marked")

        if (isMarked) {
          if (!selectedPattern.value.includes(positionId)) {
            selectedPattern.value.unshift(positionId)
          }
        } else {
          selectedPattern.value = selectedPattern.value.filter((id) => id !== positionId)
        }
        selectedPattern.value = [...selectedPattern.value]
        saveGameMode(selectedPattern.value)
        emit("pattern-changed", selectedPattern.value)
      }
    }

    const API_BASE_URL = process.env.VITE_API_BASE_URL

    const saveGameMode = async (pattern) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/game-mode-data`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gamePattern: pattern,
          }),
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        console.log("Patrón del juego guardado:", result.message)
      } catch (error) {
        console.error("Error al guardar el patrón del juego:", error)
      }
    }

    onMounted(() => {
      generateGameModeData()
      props.initialPattern.forEach((positionId) => {
        const button = document.getElementById(positionId)
        if (button && !button.classList.contains("marked")) {
          button.classList.add("marked")
        }
      })
    })

    watch(
      () => props.initialPattern,
      (newPattern) => {
        selectedPattern.value = [...newPattern]
        gameModeData.value.forEach((column) => {
          column.forEach((cell) => {
            if (cell.type === "number" && document.getElementById(cell.id)) {
              const button = document.getElementById(cell.id)
              if (newPattern.includes(cell.id)) {
                if (!button.classList.contains("marked")) {
                  button.classList.add("marked")
                }
              } else {
                if (button.classList.contains("marked")) {
                  button.classList.remove("marked")
                }
              }
            }
          })
        })
      },
      { deep: true }
    )

    const hasSelectedPattern = computed(() => selectedPattern.value.length > 0)
    const isClearModeDisabled = computed(() => !hasSelectedPattern.value)

    const reiniciarModoConConfirmacionLocal = () => {
      if (
        hasSelectedPattern.value &&
        window.confirm("¿Estás seguro de que quieres limpiar el patrón de juego? Esto borrará la selección actual.")
      ) {
        console.log("Confirmación de reinicio del modo (local) aceptada.")
        emit("reiniciar-modo")
      } else if (!hasSelectedPattern.value) {
        console.log("No hay patrón seleccionado para limpiar (local).")
      } else {
        console.log("Confirmación de reinicio del modo (local) cancelada.")
      }
    }
    
    const isPatternFull = computed(() => selectedPattern.value.length === FULL_PATTERN.length)

    const isFillModeDisabled = computed(() => isPatternFull.value)

    const llenarModoConConfirmacionLocal = () => {
      if (
        !isPatternFull.value &&
        window.confirm("¿Estás seguro de que quieres llenar el patrón de juego? Esto seleccionará todas las casillas disponibles.")
      ) {
        console.log("Confirmación de llenado del modo (local) aceptada.")
        emit("llenar-modo", FULL_PATTERN) 
      } else if (isPatternFull.value) {
        console.log("El patrón ya está completamente lleno (local).")
      } else {
        console.log("Confirmación de llenado del modo (local) cancelada.")
      }
    }

    return {
      gameModeData,
      togglePattern,
      selectedPattern,
      isClearModeDisabled,
      reiniciarModoConConfirmacionLocal,
      isFillModeDisabled,
      llenarModoConConfirmacionLocal,
    }
  },
}
</script>

<style scoped>
/* game-mode */
#game-mode {
  grid-template-rows: auto 1fr auto;
  place-items: inherit;
}
/* ... (Los estilos CSS permanecen sin cambios) ... */
.layout-mode {
  background-color: rgb(229, 228, 226);
  padding: calc(var(--gap) / 2);
  border-radius: 4px;
  display: grid;
}

/* Grid Game Mode */
#grid-game-mode {
  display: grid;
  gap: 2px;
  grid-template-columns: repeat(5, 1fr);
}

/* Groups and Cells */
#grid-game-mode .group {
  display: grid;
  gap: 2px;
  grid-template-rows: auto repeat(5, 1fr);
}
#grid-game-mode .cell {
  display: grid;
}

/* General Buttons */
#grid-game-mode .btn-ggm {
  color: white;
  /* aspect-ratio: 1 / 1; */
  border: none;
  border-radius: 2px;
  /* display: grid; */
  /* place-items: center; */
  cursor: pointer;
  user-select: none;
}

/* Letter Button */
#grid-game-mode .letter {
  background-color: rgb(178, 190, 181);
  color: rgba(255, 255, 255, 0.5);
  font-size: 2.4rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) * 2 / 2);
}

/* Number Button */
#grid-game-mode .num {
  background-color: rgb(137, 148, 153);
  color: rgba(255, 255, 255, 0.32);
  font-size: 1.2rem;
  font-weight: var(--fw-bold);
}

/* Middle Button */
#grid-game-mode .middle {
  background-color: rgb(211, 211, 211);
  color: rgb(224, 223, 223);
  font-size: 1.2rem;
  font-weight: var(--fw-bold);
}

/* Letter Button Status */
#grid-game-mode .letter:hover {
  background-color: rgb(138, 154, 91);
  color: rgb(95, 133, 117);
}
#grid-game-mode .letter:active {
  background-color: rgb(95, 133, 117);
  color: rgba(178, 190, 181, 0.8);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(132, 136, 132, 0.5);
}
#grid-game-mode .letter.marked {
  background-color: rgb(138, 154, 91);
  color: rgba(178, 190, 181, 0.8);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(132, 136, 132, 0.5);
}

/* Number Button Status */
#grid-game-mode .num:hover {
  /* background-color: rgb(227, 115, 94); */
  /* color: rgba(255, 229, 180, 0.95); */
}
#grid-game-mode .num:active {
  background-color: rgb(233, 116, 81);
  color: rgba(250, 249, 246, 0.75);
  text-shadow: 2px 2px 2px rgba(139, 64, 0, 0.75);
  box-shadow: inset 0 0 8px 1px rgba(139, 64, 0, 0.64);
}
#grid-game-mode .num.marked {
  background-color: rgb(233, 116, 81);
  color: rgba(250, 249, 246, 0.75);
  text-shadow: 2px 2px 2px rgba(139, 64, 0, 0.75);
  box-shadow: inset 0 0 8px 1px rgba(139, 64, 0, 0.64);
}

/* Middel Button Status */
#grid-game-mode .middle:hover {
  background-color: rgb(95, 158, 160);
  color: rgb(175, 225, 175);
}
#grid-game-mode .middle:active {
  background-color: rgb(95, 133, 117);
  color: rgba(224, 223, 223, 0.75);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(64, 130, 109, 0.5);
}

/* Border Radius Grid */
#grid-game-mode .group:first-child .cell:first-child button {
  border-top-left-radius: 4px;
}
#grid-game-mode .group:last-child .cell:first-child button {
  border-top-right-radius: 4px;
}

/* Options Mode */
#game-mode .options-mode {
  display: grid;
}
#game-mode .options-mode .btn-opm {
  font-size: 1.6rem;
  padding: 8px 16px;
  font-weight: var(--fw-bold);
  border: none;
  border-radius: 4px;
}

/* Estilos para los controles del módulo */
#game-mode--control {
  /* background-color: rgba(237, 234, 222, 0.75); */
  width: 100%;
  padding: var(--gap);
  border-radius: calc(var(--gap) / 2);
  margin-top: 4px;
}

#game-mode--control .game-controls-list {
  display: grid;
  gap: var(--gap, 8px);
  grid-auto-flow: column;
  justify-content: center;
}
</style>
