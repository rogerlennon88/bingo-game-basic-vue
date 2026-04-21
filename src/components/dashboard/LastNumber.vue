<template>
  <div id="last-number" class="module">
    <h2 class="title-2">Última Balota</h2>
    <span class="ball num-1">{{ ultimaBalota }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()

const ultimaBalota = computed(() => {
  const balls = store.gameState.markedBalls
  return balls.length > 0 ? balls[0] : ""
})
</script>

<style scoped>
/* Pega aquí exactamente los mismos estilos de tu LastNumber.vue original */
#last-number {
  padding-bottom: calc(var(--gap) * 1.5);
}
#last-number .num-1 {
  background-color: white;
  color: rgb(25, 25, 112);
  font-size: 4.8rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap));
  border: 6px solid rgba(233, 220, 201, 0.75);
  border-radius: 100%;
}
.ball {
  min-width: 84px;
  min-height: 84px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 2px 1px rgba(181, 168, 150, 0.6);
}
</style>
