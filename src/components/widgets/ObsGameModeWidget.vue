<template>
  <div class="game-mode-container hardware-accelerated">
    <div class="grid-game-mode">
      <div v-for="(column, columnIndex) in gameModeData" :key="columnIndex" class="group">
        <div v-for="cell in column" :key="cell.id" class="cell" :class="cell.type">
          <span
            v-if="cell.type === 'number'"
            :id="cell.id"
            class="btn-ggm"
            :class="{
              middle: cell.isMiddle,
              marked: isPositionMarked(cell.id),
            }"
          >
            {{ cell.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()
const markedPattern = computed(() => store.gameState.gamePattern || [])

// 1. Estandarización de constantes
const BINGO_LETTERS = ["B", "I", "N", "G", "O"]
const ROWS_PER_COLUMN = 5

// 2. Optimización: Generación de la Matriz 5x5 como Computed Estático
// Al no depender de estados reactivos, se evalúa una vez y se cachea
const gameModeData = computed(() => {
  const data = []

  BINGO_LETTERS.forEach((letter) => {
    const letterLower = letter.toLowerCase()
    const column = [{ type: "letter", value: letter, id: `${letterLower}-ggm` }]

    for (let rowIndex = 1; rowIndex <= ROWS_PER_COLUMN; rowIndex++) {
      const id = `${letterLower}${rowIndex}`
      const isCenterFreeSpace = letter === "N" && rowIndex === 3

      column.push({
        type: "number",
        value: id,
        id: id,
        isMiddle: isCenterFreeSpace,
      })
    }
    data.push(column)
  })

  return data
})

// 3. Helper de validación
const isPositionMarked = (positionId) => markedPattern.value.includes(positionId)
</script>

<style scoped>
/* =========================================
   1. CONTENEDOR PRINCIPAL Y ESCALADO
   ========================================= */
.hardware-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

.game-mode-container {
  width: 100%;
  height: 100%;
  /* Permite que el grid use cqmin para escalar proporciones y bordes */
  container-type: size;
  display: grid;
  place-items: center;
  background-color: transparent;
  font-family: "Aktiv Grotesk Ex Trial XBold", Arial, sans-serif;
}

/* =========================================
   2. GRID GEOMÉTRICO (CARTÓN 5x5)
   ========================================= */
.grid-game-mode {
  /* Ocupa el 100% de su contenedor menor y mantiene proporción perfectamente cuadrada */
  height: 100cqmin;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.6cqmin; /* Separación fluida entre columnas */
  padding: 8px; /* Padding de aire interno */
  background-color: rgba(229, 228, 226, 0.2); /* Fondo base muy sutil */
  border: 1px solid fuchsia; /* Borde original de diagnóstico/diseño */
}

.group {
  display: grid;
  /* El diseño de OBS solo muestra los 5 números (oculta las letras) */
  grid-template-rows: repeat(5, 1fr);
  gap: 2cqmin; /* Separación fluida entre filas */
}

/* Ocultamos la celda de la letra para que quede el grid 5x5 limpio */
.cell.letter {
  display: none;
}

.cell {
  display: grid;
}

/* =========================================
   3. CELDAS INDIVIDUALES (BALOTAS)
   ========================================= */
.btn-ggm {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  border: none;
  border-radius: 16px;
  display: grid;
  place-items: center;
  user-select: none;

  /* Textura base para celdas vacías */
  background-color: rgba(255, 255, 255, 0.1);
  color: transparent; /* Oculta el texto como en el original */
  transition: all 0.3s ease;
}

.btn-ggm.middle {
  background-color: rgba(211, 211, 211, 0.5); /* Centro "Free" */
}

/* =========================================
   4. ESTADO MARCADO Y ASSETS AUTÓNOMOS
   ========================================= */
.btn-ggm.marked {
  background-color: #bcbd48;
  /* Uso de ruta absoluta /views-media/ para independencia total */
  background-image: url("/views-media/game-mode/icon--btn-marked--game-mode.png"), linear-gradient(0deg, #65033e 1%, #7f0554 51%, #7f0554);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  /* Bordes y sombras escalables con cqmin */
  border: 8px solid #ffc200;
  box-shadow: inset 0 0 4cqmin 1cqmin #e3004b;
}

.btn-ggm.middle.marked {
  background-color: rgb(95, 158, 160);
  background-image: none; /* Quitamos la estrella/ficha si el centro es distinto */
  border: none;
  box-shadow: none;
}
</style>
