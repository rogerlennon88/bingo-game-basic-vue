<!-- src/components/modules/LastNumberList.vue -->

<template>
  <div id="last-number-list" class="module">
    <h2>Últimas 4 Balotas</h2>
    <ul class="number-list">
      <li v-for="(ball, index) in displayedBalls" :key="ball || index" class="item">
        <span class="ball num-2">{{ ball }}</span>
      </li>
      <li v-if="displayedBalls.length < 4" v-for="i in 4 - displayedBalls.length" :key="'empty-' + i" class="item">
        <span class="ball num-2"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from "vue"

export default {
  name: "LastNumberList",
  props: {
    markedBalls: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const displayedBalls = computed(() => {
      return props.markedBalls.slice(1, 5) // Tomar desde el segundo hasta el quinto elemento
    })

    return {
      displayedBalls,
    }
  },
}
</script>

<style scoped>
/* last-number-list */
#last-number-list {
  padding-bottom: calc(var(--gap) * 1.5);
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

.ball {
  min-width: 64px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 2px 1px rgba(181, 168, 150, 0.6);
}
</style>
