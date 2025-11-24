<template>
  <div id="counter-view">
    <div class="data counter-view-data-1" :class="{ actived: counter > 0 }">{{ counter }}</div>
    <div class="data counter-view-div">/</div>
    <div class="data counter-view-data-2">75</div>
  </div>
</template>

<script setup>
import { useGameData } from "../composables/useGameData"

// El composable se encarga de todo
const { counter } = useGameData(1000)
</script>

<style scoped>
/* Tus estilos CSS existentes se mantienen intactos */
#counter-view {
  background-color: rgb(169, 169, 169);
  color: rgb(211, 211, 211);
  font-size: 8rem;
  line-height: 1;
  text-shadow: 0 0 8px rgba(112, 128, 144, 0.8);
  padding: 8px;
  border-radius: 10px;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(5, 1fr);
  gap: calc(var(--gap) / 2);
}
#counter-view .data {
  padding: calc(var(--gap) / 2);
  display: grid;
  place-items: center;
}
#counter-view .data.counter-view-data-1,
#counter-view .data.counter-view-data-2 {
  font-weight: var(--fw-bold);
}
#counter-view .data.counter-view-data-1 {
  border-radius: 8px 0 0 8px;
  grid-column: 2 span;
  justify-content: end;
}
#counter-view .data.counter-view-div {
  grid-column: 1 span;
}
#counter-view .data.counter-view-data-2 {
  border-radius: 0 8px 8px 0;
  grid-column: 2 span;
}
#counter-view .data.actived {
  color: var(--color-white);
}
</style>
