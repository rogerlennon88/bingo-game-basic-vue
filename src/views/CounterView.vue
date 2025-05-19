<template>
  <div id="counter-view">
    <div class="data counter-view-data-1" :class="{ actived: counterValue > 0 }">{{ counterValue }}</div>
    <div class="data counter-view-div">/</div>
    <div class="data counter-view-data-2">75</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const counterValue = ref(0)

async function fetchCounterValue() {
  try {
    const response = await fetch("http://localhost:3000/api/game-board-data")
    if (!response.ok) {
      throw new Error("HTTP error! status: ${response.status}")
    }
    const data = await response.json()
    counterValue.value = data.counter || 0
  } catch (error) {
    console.error("Error al obtener el valor del contador:", error)
  }
}

onMounted(() => {
  fetchCounterValue()
  setInterval(fetchCounterValue, 1000)
})
</script>

<style scoped>
#counter-view {
  background-color: rgb(169, 169, 169);
  color: rgb(169, 169, 169);
  font-size: 8rem;
  padding: 8px;
  border-radius: 10px;
  display: grid;
  grid-auto-flow: column;
  gap: calc(var(--gap) / 2);
  place-content: center;
}
#counter-view .data {
  background-color: rgb(129, 133, 137);
  padding: var(--gap);
  display: grid;
  place-items: center;
}
#counter-view .data.counter-view-data-1,
#counter-view .data.counter-view-data-2 {
  font-weight: var(--fw-bold);
  aspect-ratio: 4 / 3;
}
#counter-view .data.counter-view-data-1 {
  border-radius: 8px 0 0 8px;
}
#counter-view .data.counter-view-div {
  background-color: inherit;
  color: rgb(129, 133, 137);
}
#counter-view .data.counter-view-data-2 {
  border-radius: 0 8px 8px 0;
}
#counter-view .data.actived {
    color:  rgb(244, 187, 68);
}
</style>
