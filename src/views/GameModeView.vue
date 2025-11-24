<template>
  <div id="game-mode-view" class="module">
    <div class="layout-mode">
      <div id="grid-game-mode-view" class="grid-game-mode">
        <div v-for="(column, columnIndex) in gameModeData" :key="columnIndex" class="group">
          <div v-for="cell in column" :key="cell.id" class="cell">
            <span
              :id="cell.id"
              class="btn-ggm"
              :class="{
                letter: cell.type === 'letter',
                num: cell.type === 'number' && !cell.isMiddle,
                middle: cell.isMiddle,
                lock: cell.type === 'letter' || cell.isMiddle,
                marked: isPositionMarked(cell.id),
              }"
            >
              {{ cell.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useGameData } from "../composables/useGameData"

// Usamos el composable, pero renombramos la variable para que coincida con tu lógica
const { gamePattern: markedPattern } = useGameData(1000)

const letters = ["B", "I", "N", "G", "O"]
const rows = 5
const gameModeData = ref([])

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

const isPositionMarked = (positionId) => {
  return markedPattern.value.includes(positionId)
}

onMounted(() => {
  generateGameModeData()
})
</script>

<style scoped>
/* Tus estilos existentes intactos */
/* game-mode-view */

#game-mode-view.module {
  background-color: inherit;
  border: 4px solid fuchsia;
  height: 100%;
  aspect-ratio: 1 / 1;
}

.layout-mode {
  background-color: inherit;
  padding: calc(var(--gap) / 2);
  border-radius: 4px;
}

/* Grid Game Mode */
#grid-game-mode-view {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(5, 1fr);
}

/* Groups and Cells */
#grid-game-mode-view .group {
  display: grid;
  gap: 12px;
}
#grid-game-mode-view .cell {
  display: grid;
}

/* General Span */
#grid-game-mode-view .btn-ggm {
  color: transparent;
  aspect-ratio: 1 / 1;
  border: none;
  border-radius: 32px;
  display: grid;
  place-items: center;
  user-select: none;
}

/* Letter Span */
#grid-game-mode-view .letter {
  background-color: transparent;
  color: transparent;
  font-size: 2.4rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) * 2 / 2);
}

/* Number Span */
#grid-game-mode-view .num {
  background-color: transparent;
  color: transparent;
  font-size: 15rem;
  font-weight: var(--fw-bold);
}

/* Middle Span */
#grid-game-mode-view .middle {
  background-color: rgb(211, 211, 211);
  color: transparent;
  font-size: 1.2rem;
  font-weight: var(--fw-bold);
  opacity: 0;
}

/* Letter Span Status */
#grid-game-mode-view .letter.marked {
  background-color: rgb(138, 154, 91);
  color: transparent;
  text-shadow: none;
  box-shadow: none;
}

/* Number Span Status */
#grid-game-mode-view .num.marked {
  background: #bcbd48;
  background-image: url("../../public/views-media/game-mode/icon--btn-marked--game-mode.png"),
    linear-gradient(0deg, #65033e 1%, #7f0554 51%, #7f0554);
  background-size: contain;
  background-repeat: no-repeat;
  border: 6px solid #ffc200;
  color: transparent;
  text-shadow: none;
  box-shadow: inset 0 0 32px 4px #e3004b;
}

/* Middle Span Status */
#grid-game-mode-view .middle.marked {
  background-color: rgb(95, 158, 160);
  color: transparent;
  text-shadow: none;
  box-shadow: none;
}

#grid-game-mode-view .group .cell:first-child {
  display: none;
}

/* Border Radius Grid */
#grid-game-mode-view .group:first-child .cell:first-child span {
  border-top-left-radius: 4px;
}
#grid-game-mode-view .group:last-child .cell:first-child span {
  border-top-right-radius: 4px;
}
</style>
