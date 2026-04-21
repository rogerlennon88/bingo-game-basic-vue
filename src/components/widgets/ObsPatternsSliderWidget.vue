<template>
  <div id="patterns-slider-view">
    <transition name="slide-fade">
      <div v-if="currentPattern" :key="currentPattern.id" class="slide-wrapper">
        <div class="image-box" :class="{ 'is-completed': currentPattern.completed }">
          <img :src="currentPattern.image" :alt="currentPattern.name" class="main-img" />
          <img v-if="currentPattern.completed" src="/img/patterns/stamp-completed.png" class="stamp" alt="Completed" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()

const patternsList = computed(() => store.config.patterns || [])
const slideDuration = computed(() => store.config.slideDuration || 5000)

const currentIndex = ref(0)
let sliderInterval = null

const currentPattern = computed(() => {
  if (patternsList.value.length === 0) return null
  return patternsList.value[currentIndex.value]
})

// OPTIMIZACIÓN: Pre-carga de imágenes en memoria del navegador
const preloadImages = (patterns) => {
  patterns.forEach((pattern) => {
    if (pattern.image) {
      const img = new Image()
      img.src = pattern.image
    }
  })
  // Precargar también el sello de completado
  const stampImg = new Image()
  stampImg.src = "/img/patterns/stamp-completed.png"
}

const startSlider = () => {
  stopSlider()
  if (patternsList.value.length > 0) {
    sliderInterval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % patternsList.value.length
    }, slideDuration.value)
  }
}

const stopSlider = () => {
  if (sliderInterval) clearInterval(sliderInterval)
}

watch(
  patternsList,
  (newVal) => {
    if (newVal.length > 0) {
      preloadImages(newVal)
      if (!sliderInterval) startSlider()
    }
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  if (patternsList.value.length > 0) {
    preloadImages(patternsList.value)
    startSlider()
  }
})

onUnmounted(() => stopSlider())
</script>

<style scoped>
#patterns-slider-view {
  position: relative;
  width: 486px;
  height: 639px;
  background-color: transparent;
  overflow: hidden;
  margin: 0;
  padding: 0;
  /* OPTIMIZACIÓN: Aísla el renderizado de este contenedor */
  contain: strict;
  transform: translateZ(0);
}

.slide-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* OPTIMIZACIÓN: Prepara la GPU para animar estas propiedades */
  will-change: transform, opacity;
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

.image-box.is-completed .main-img {
  filter: grayscale(100%) invert(100%) opacity(32%);
  transition: filter 0.3s ease; /* Transición suave al completar */
}

.stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(0);
  width: 90%;
  z-index: 10;
  will-change: opacity, transform;
  animation: stamp-fade-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Animación más natural */
}

@keyframes stamp-fade-in {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8) translateZ(0);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) translateZ(0);
  }
}

/* OPTIMIZACIÓN: Transición Slide + Fade forzando la aceleración 3D */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
</style>
