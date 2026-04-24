<template>
  <div class="main-ball-widget hardware-accelerated">
    <Transition name="pop" mode="out-in">
      <div v-if="lastNumber" :key="lastNumber" class="ball-graphic" :class="'ball-' + getColumnLetter(lastNumber)">
        <span class="letter">{{ getColumnLetter(lastNumber) }}</span>
        <span class="number">{{ lastNumber }}</span>
      </div>
      <div v-else class="ball-graphic ball-empty"></div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()
const markedBalls = computed(() => store.gameState.markedBalls)

// Toma siempre el primer elemento del array (la última balota marcada)
const lastNumber = computed(() => (markedBalls.value.length > 0 ? markedBalls.value[0] : null))

const getColumnLetter = (ballNumber) => {
  if (!ballNumber) return ""
  const n = Number(ballNumber)
  if (n >= 1 && n <= 15) return "b"
  if (n >= 16 && n <= 30) return "i"
  if (n >= 31 && n <= 45) return "n"
  if (n >= 46 && n <= 60) return "g"
  if (n >= 61 && n <= 75) return "o"
  return ""
}
</script>

<style scoped>
.hardware-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}

.main-ball-widget {
  width: 100%;
  height: 100%;
  /* CRÍTICO: Permite que el texto escale según el tamaño de la caja (crop), no de la pantalla */
  container-type: size;
  display: grid;
  place-items: center;
}

.ball-graphic {
  /* Ocupa el 90% del lado más corto del crop para no tocar los bordes */
  width: 90cqmin;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Efecto de sombra 3D para darle volumen */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.ball-empty {
  background-image: url("/views-media/main-obs-fullhd/ball-empty.png");
  box-shadow: none;
  opacity: 0.3;
}

.letter {
  font-family: "Aktiv Grotesk Ex Trial XBold", Arial, sans-serif;
  font-size: 12cqmin; /* Escala relativa al contenedor */
  text-transform: uppercase;
  color: #2c2c2c;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: -2cqmin; /* Ajuste fino de kerning vertical */
}

.number {
  font-family: "Aktiv Grotesk Ex Trial XBold", Arial, sans-serif;
  font-size: 26cqmin; /* Escala relativa al contenedor */
  font-variant-numeric: tabular-nums;
  color: #2c2c2c;
  line-height: 0.95;
  text-shadow: 3px 4px 8px rgba(0, 0, 0, 0.5);
}

/* Animación de entrada estilo "Pop" 3D */
.pop-enter-active {
  animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse;
}

@keyframes pop-in {
  0% {
    transform: scale(0.5);
    opacity: 0;
    filter: blur(5px);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    filter: blur(0);
  }
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
