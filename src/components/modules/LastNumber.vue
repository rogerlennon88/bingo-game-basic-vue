<!-- src/components/modules/LastNumber.vue -->

<template>
  <div id="last-number" class="module">
    <h2 class="title-2">Última Balota</h2>
    <span class="ball num-1">{{ ultimaBalota }}</span>
  </div>
</template>

<script>
import { computed } from "vue"

export default {
  name: "LastNumber",
  props: {
    markedBalls: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const ultimaBalota = computed(() => {
      return props.markedBalls.length > 0 ? props.markedBalls[0] : ""
    })

    return {
      ultimaBalota,
    }
  },
}
</script>

<style scoped>
/* last-number */
#last-number {
  padding-bottom: calc(var(--gap) * 1.5);
}
#last-number .num-1 {
  background-color: white;
  color: rgb(25, 25, 112);
  font-size: 6.4rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) * 2);
  border: 6px solid rgba(233, 220, 201, 0.75);
  border-radius: 50%;
}

.ball {
  min-width: 128px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 2px 1px rgba(181, 168, 150, 0.6);
}
</style>
