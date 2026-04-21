<template>
  <div class="score hardware-accelerated">
    <h3 class="score--title">Últimas Balotas</h3>
    <div class="score--body">
      <div id="last-number-mofv-view" class="ball" :class="'ball-' + getColumnLetter(lastNumber)">
        <span class="mofv-letter">{{ getColumnLetter(lastNumber) }}</span>
        <span class="mofv-number">{{ lastNumber }}</span>
      </div>
      <ul id="last-number-list-mofv-view">
        <li class="item" v-for="i in 3" :key="i">
          <span class="ball" :class="'ball-' + getColumnLetter(displayedNumbers[i])">
            <span class="mofv-letter">{{ getColumnLetter(displayedNumbers[i]) }}</span>
            <span class="mofv-number">{{ displayedNumbers[i] || "" }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()
const markedBalls = computed(() => store.gameState.markedBalls)

const lastNumber = computed(() => (markedBalls.value.length > 0 ? markedBalls.value[0] : ""))

const displayedNumbers = computed(() => {
  const result = { 1: "", 2: "", 3: "" }
  for (let i = 1; i <= 3; i++) {
    if (markedBalls.value.length > i) result[i] = markedBalls.value[i]
  }
  return result
})

const getColumnLetter = (ballNumber) => {
  if (!ballNumber) return ""
  const n = Number(ballNumber)
  if (n >= 1 && n <= 15) return "b"
  if (n >= 16 && n <= 30) return "i"
  if (n >= 31 && n <= 45) return "n"
  if (n >= 46 && n <= 60) return "g"
  if (n >= 61 && n <= 75) return "o"
  return ""
}
</script>

<style scoped>
/* OPTIMIZACIÓN: Previene que cambios internos alteren elementos externos en OBS */
.hardware-accelerated {
  transform: translateZ(0);
  contain: layout paint;
  will-change: contents;
}

.mofv-number {
  /* OPTIMIZACIÓN: Evita que el tamaño de la fuente cambie el ancho de la balota si el número es "1" vs "8" */
  font-variant-numeric: tabular-nums;
}

.ball {
  /* Transición suave para cambios de color de fondo al cambiar la clase ball-b, ball-i, etc. */
  transition:
    background-image 0.2s ease,
    background-color 0.2s ease;
  will-change: background-image;
}
</style>
