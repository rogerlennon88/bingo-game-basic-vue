<template>
  <div id="patterns-slider-view">
    <transition name="slide">
      <div v-if="currentPattern" :key="currentPattern.id" class="slide-wrapper">
        <div class="image-box" :class="{ 'is-completed': currentPattern.completed }">
          <img :src="currentPattern.image" :alt="currentPattern.name" class="main-img" />

          <img v-if="currentPattern.completed" src="/img/patterns/stamp-completed.png" class="stamp" alt="Completado" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useGameData } from "../composables/useGameData"

const { patternsList, sliderConfig } = useGameData(1000)
const currentIndex = ref(0)
let sliderInterval = null

const currentPattern = computed(() => {
  if (patternsList.value.length === 0) return null
  return patternsList.value[currentIndex.value]
})

const startSlider = () => {
  stopSlider()
  if (patternsList.value.length > 0) {
    sliderInterval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % patternsList.value.length
    }, sliderConfig.value.slideDuration || 5000)
  }
}

const stopSlider = () => {
  if (sliderInterval) clearInterval(sliderInterval)
}

watch(patternsList, (newVal) => {
  if (!sliderInterval && newVal.length > 0) startSlider()
})

onMounted(() => startSlider())
onUnmounted(() => stopSlider())
</script>

<style scoped>
/* Contenedor Principal: Tamaño fijo y ubicación Top-Left */
#patterns-slider-view {
  position: relative;
  width: 486px;
  height: 639px;
  background-color: #fff;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* Wrapper de cada Slide */
.slide-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.image-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Efecto Grayscale al completar */
.image-box.is-completed .main-img {
  filter: grayscale(100%) invert(100%) opacity(32%);
}

/* --- SELLO CORREGIDO --- */
.stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Solo centrado, SIN rotación ni escala */
  transform: translate(-50%, -50%);

  /* Ajusta este valor si quieres que el sello sea más grande o pequeño */
  width: 90%;

  z-index: 10;

  /* Animación suave solo de opacidad */
  animation: stamp-fade-in 0.5s ease-out;
}

@keyframes stamp-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* --- TRANSICIÓN SLIDE (Derecha a Izquierda) --- */

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.6s ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}
</style>
