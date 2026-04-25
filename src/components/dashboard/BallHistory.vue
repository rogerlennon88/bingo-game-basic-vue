<template>
  <div id="last-number" class="module">
    <h2 class="title-2">Última Balota</h2>
    <span class="ball num-1">{{ lastBall }}</span>
  </div>

  <div id="last-number-list" class="module">
    <h2 class="title-2">Últimas 4 Balotas</h2>
    <ul class="number-list">
      <li v-for="(ball, index) in recentHistory" :key="ball || index" class="item">
        <span class="ball num-2">{{ ball }}</span>
      </li>
      <li v-if="recentHistory.length < 4" v-for="i in 4 - recentHistory.length" :key="'empty-' + i" class="item">
        <span class="ball num-2"></span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()

// Consumimos la información directamente de los Getters que creamos en el Store
const lastBall = computed(() => store.lastBall)
const recentHistory = computed(() => store.recentHistory)
</script>

<style scoped>
/* =========================================
   ESTILOS ORIGINALES INTACTOS FUSIONADOS
   ========================================= */
#last-number,
#last-number-list {
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

#last-number-list .number-list {
  display: grid;
  grid-auto-flow: column;
  gap: var(--gap);
  place-content: center;
}

#last-number-list .number-list .item {
  display: grid;
}

#last-number-list .number-list .item span {
  background-color: white;
  color: rgb(25, 25, 112);
  font-size: 3.2rem;
  padding: var(--gap);
  font-weight: var(--fw-bold);
  border: 3px solid rgba(233, 220, 201, 0.75);
  border-radius: 50%;
}

/* Clase base de balota compartida por ambos módulos */
.ball {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  box-shadow: 0px 4px 2px 1px rgba(181, 168, 150, 0.6);
}

/* Tamaños específicos heredados de tus componentes anteriores */
#last-number .ball {
  min-width: 84px;
  min-height: 84px;
}

#last-number-list .ball {
  min-width: 64px;
}
</style>
