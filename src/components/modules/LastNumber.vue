<template>
  <div id="last-number" class="module">
    <h2>Última Balota</h2>
    <span class="ball num-1">{{ ultimaBalota }}</span>
  </div>
</template>

<script>
import { ref } from "vue"

export default {
  name: "LastNumber",
  props: {
    ultimaBalota: {
      type: String, // Cambiamos el tipo a String
      default: "", // Cambiamos el valor por defecto a un string vacío
    },
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
  min-width: 160px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 4px 2px 1px rgba(216, 216, 216, 0.6), 0px 4px 2px 1px rgba(181, 168, 150, 0.6);
}
</style>
