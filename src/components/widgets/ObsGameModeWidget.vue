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
import { ref, computed, onMounted } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()
const markedPattern = computed(() => store.gameState.gamePattern || [])

const letters = ["B", "I", "N", "G", "O"]
const gameModeData = ref([])

const generateGameModeData = () => {
  const data = []
  letters.forEach((letter) => {
    const column = [{ type: "letter", value: letter, id: `${letter.toLowerCase()}-ggm` }]
    for (let rowIndex = 1; rowIndex <= 5; rowIndex++) {
      const id = `${letter.toLowerCase()}${rowIndex}`
      column.push({ type: "number", value: id, id: id, isMiddle: letter === "N" && rowIndex === 3 })
    }
    data.push(column)
  })
  gameModeData.value = data
}

const isPositionMarked = (positionId) => markedPattern.value.includes(positionId)

onMounted(() => generateGameModeData())
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
  /* Ocupa el 90% del contenedor y mantiene proporción perfectamente cuadrada */
  height: 100cqmin;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.6cqmin; /* Separación fluida entre columnas */
  padding: 8px;
  background-color: rgba(229, 228, 226, 0.2); /* Fondo base muy sutil */
  border: 1px solid fuchsia; /* Tu borde original de diagnóstico/diseño */
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
  border-radius: 16px; /* Cambiado a 50% para que sean círculos perfectos */
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
  background-image: none; /* Quitamos la estrella/ficha si el centro es distinto, o puedes mantenerla */
  border: none;
  box-shadow: none;
}
</style>
