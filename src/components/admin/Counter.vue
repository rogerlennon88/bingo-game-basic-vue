<template>
  <div id="counter" class="module">
    <h2 class="title-2">Balotas</h2>
    <div class="counter--grid">
      <div class="data counter--data-1" :class="{ actived: counter > 0 }">
        {{ counter }}
      </div>
      <div class="data counter--div">/</div>
      <div class="data counter--data-2">75</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()
// Reactividad directa al store
const counter = computed(() => store.gameState.counter)
</script>

<style scoped>
/* Pega aquí exactamente los mismos estilos de tu Counter.vue original */
#counter {
  padding-bottom: calc(var(--gap) * 1.5);
}
.counter--grid {
  background-color: rgb(169, 169, 169);
  color: rgb(211, 211, 211);
  font-size: 2.4rem;
  line-height: 1;
  text-shadow: 0 0 8px rgba(112, 128, 144, 0.8);
  padding: 8px;
  border-radius: 10px;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(5, 1fr);
  gap: calc(var(--gap) / 2);
}
.data {
  padding: calc(var(--gap) / 2);
  display: grid;
  place-items: center;
}
.data.counter--data-1,
.data.counter--data-2 {
  font-weight: var(--fw-bold);
}
.data.counter--data-1 {
  border-radius: 8px 0 0 8px;
  grid-column: 2 span;
  justify-content: end;
}
.data.counter--div {
  grid-column: 1 span;
}
.data.counter--data-2 {
  border-radius: 0 8px 8px 0;
  grid-column: 2 span;
}
.data.actived {
  color: var(--color-white);
}
</style>
