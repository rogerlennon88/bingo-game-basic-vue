<template>
  <div class="score">
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
