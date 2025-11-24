<template>
  <ul id="last-number-list-view" :class="directionClass">
    <li class="item" v-for="i in 4" :key="i">
      <span class="ball">{{ displayedNumbers[i] || "" }}</span>
    </li>
  </ul>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useGameData } from "../composables/useGameData"

const route = useRoute()
const { markedBalls } = useGameData(1000)

const direction = computed(() => route.params.direction)

const directionClass = computed(() => {
  return direction.value === "y" ? "dir-y" : "dir-x"
})

const displayedNumbers = computed(() => {
  const result = { 1: "", 2: "", 3: "", 4: "" }
  for (let i = 1; i <= 4; i++) {
    if (markedBalls.value.length > i) {
      result[i] = markedBalls.value[i]
    }
  }
  return result
})
</script>

<style scoped>
/* Tus estilos existentes */
#last-number-list-view {
  display: grid;
  gap: var(--gap);
}
#last-number-list-view li {
  display: flex;
}
.dir-x {
  grid-auto-flow: column;
  grid-template-columns: repeat(4, 1fr);
}
.dir-y {
  grid-auto-flow: row;
  grid-template-rows: repeat(4, 1fr);
}
.ball {
  background-color: white;
  color: rgb(25, 25, 112);
  font-size: 12rem;
  font-weight: var(--fw-bold);
  min-width: 180px;
  padding: 16px;
  border: 12px solid rgba(233, 220, 201, 0.75);
  border-radius: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
