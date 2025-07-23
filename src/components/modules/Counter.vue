<template>
  <div id="counter-container" class="module">
    <h2 class="title-2">Cantidad</h2>
    <div class="counter-group">
      <div class="data counter-data-1" :class="{ actived: counterValue > 0 }">{{ counterValue }}</div>
      <div class="data counter-div">/</div>
      <div class="data counter-data-2">75</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"

export default {
  name: "Counter",
  setup() {
    const counterValue = ref(0)
    const API_BASE_URL = process.env.VITE_API_BASE_URL;

    async function fetchCounterValue() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/game-board-data`)
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

    return {
      counterValue,
    }
  },
}
</script>

<style scoped>
#counter-container {
}
.counter-group {
  background-color: rgb(229, 228, 226);
  font-size: 2.4rem;
  line-height: 1;
  text-shadow: 0 0 8px rgba(112, 128, 144, 0.8);
  padding: calc(var(--gap) / 2);
  border-radius: 4px;
  justify-self: center;
  display: flex;
}
.counter-group .data {
  background-color: rgb(178, 190, 181);
  color: rgba(255, 255, 255, 0.5);
  padding: calc(var(--gap) / 2);
}
.counter-group .data.counter-data-1,
.counter-group .data.counter-data-2 {
  font-weight: var(--fw-bold);
}
.counter-group .data.counter-data-1 {
  border-radius: 4px 0 0 4px;
  justify-content: end;
}
.counter-group .data.counter-div {
}
.counter-group .data.counter-data-2 {
  border-radius: 0 4px 4px 0;
}
.counter-group .data.actived {
  color: var(--color-white);
}
</style>