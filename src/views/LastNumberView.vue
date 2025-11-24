<template>
  <div id="last-number-view" class="ball">
    {{ lastNumber }}
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useGameData } from "../composables/useGameData"

const { markedBalls } = useGameData(1000)

const lastNumber = computed(() => {
  return markedBalls.value.length > 0 ? markedBalls.value[0] : ""
})
</script>

<style scoped>
/* Tus estilos existentes */
#last-number-view {
  background-color: white;
  color: rgb(25, 25, 112);
  font-size: 32rem;
  font-weight: var(--fw-bold);
  width: 540px;
  padding: calc(var(--gap) * 2);
  aspect-ratio: 1 / 1;
  border: 32px solid rgba(233, 220, 201, 0.75);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ball {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
