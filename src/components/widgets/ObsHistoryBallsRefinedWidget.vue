<template>
  <div class="history-ball-widget hardware-accelerated">
    <Transition name="fade-slide" mode="out-in">
      <div v-if="historicalNumber" :key="historicalNumber" class="ball-graphic" :class="'ball-' + getColumnLetter(historicalNumber)">
        <span class="letter">{{ getColumnLetter(historicalNumber) }}</span>
        <span class="number">{{ historicalNumber }}</span>
      </div>
      <div v-else class="ball-graphic ball-empty"></div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../../stores/appStore"
import { useBingoLogic } from "../../composables/useBingoLogic"

const props = defineProps({
  historyIndex: {
    type: Number,
    required: true,
  },
})

const store = useAppStore()
const { getColumnLetter } = useBingoLogic() // Importamos la lógica centralizada

const markedBalls = computed(() => store.gameState.markedBalls)

// Toma la balota basada en el índice (1, 2, 3 o 4) del historial
const historicalNumber = computed(() => {
  if (markedBalls.value.length > props.historyIndex) {
    return markedBalls.value[props.historyIndex]
  }
  return null
})
</script>

<style scoped>
/* Compartimos exactamente la misma lógica de escalado que el widget principal.
   Al ser container queries, se ajustarán solos a su celda de 2x2 */
.hardware-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}

.history-ball-widget {
  width: 100%;
  height: 100%;
  container-type: size;
  display: grid;
  place-items: center;
}

.ball-graphic {
  width: 85cqmin;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.ball-empty {
  background-image: url("/views-media/main-obs-fullhd/ball-empty.png");
  box-shadow: none;
  opacity: 0.15; /* Más tenue para las balotas del historial vacías */
}

.letter {
  font-family: "Aktiv Grotesk Ex Trial XBold", Arial, sans-serif;
  font-size: 12cqmin;
  text-transform: uppercase;
  color: #2c2c2c;
  line-height: 1;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
  margin-bottom: -2cqmin;
}

.number {
  font-family: "Aktiv Grotesk Ex Trial XBold", Arial, sans-serif;
  font-size: 25cqmin;
  font-variant-numeric: tabular-nums;
  color: #2c2c2c;
  line-height: 0.95;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

/* Animación sutil de desplazamiento al avanzar en el historial */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease-out;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.9);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9);
}

/* =========================================
   ASSETS DE BALOTAS INDEPENDIENTES
   ========================================= */
.ball-b {
  background-image: url("/views-media/main-obs-fullhd/ball-b.png");
}
.ball-i {
  background-image: url("/views-media/main-obs-fullhd/ball-i.png");
}
.ball-n {
  background-image: url("/views-media/main-obs-fullhd/ball-n.png");
}
.ball-g {
  background-image: url("/views-media/main-obs-fullhd/ball-g.png");
}
.ball-o {
  background-image: url("/views-media/main-obs-fullhd/ball-o.png");
}
</style>
