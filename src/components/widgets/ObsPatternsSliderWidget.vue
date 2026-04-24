<template>
  <div id="patterns-slider-view" class="patterns-slider-container hardware-accelerated">
    <transition name="slide-fade">
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

const preloadImages = (patterns) => {
  patterns.forEach((pattern) => {
    if (pattern.image) {
      const img = new Image()
      img.src = pattern.image
    }
  })
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
    } else {
      stopSlider()
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
/* =========================================
   1. CONTENEDOR PRINCIPAL FLUIDO
   ========================================= */
.hardware-accelerated {
  transform: translateZ(0);
  contain: strict; /* Optimización extrema para OBS */
}

.patterns-slider-container {
  position: relative;
  width: 100%;
  height: 100%;
  /* Permite escalar el sello de 'Completado' en base al ancho/alto de la caja */
  container-type: size;
  background-color: transparent;
  overflow: hidden;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* =========================================
   2. SLIDES E IMÁGENES
   ========================================= */
.slide-wrapper {
  position: absolute;
  inset: 0; /* Ocupa todo el contenedor (top, left, right, bottom: 0) */
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
}

.image-box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-img {
  width: 100%;
  height: 100%;
  /* CRÍTICO: 'contain' asegura que el patrón nunca se recorte sin importar
     la proporción del Crop que hagas en OBS */
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.4)); /* Sombra para dar profundidad */
  transition: filter 0.3s ease;
}

/* Estado completado: oscurece y vuelve gris la tarjeta base */
.image-box.is-completed .main-img {
  filter: grayscale(100%) invert(100%) opacity(32%) drop-shadow(0 15px 25px rgba(0, 0, 0, 0.4));
}

/* =========================================
   3. SELLO DE "COMPLETADO"
   ========================================= */
.stamp {
  position: absolute;
  /* Usamos unidades cqmin para que el sello escale perfectamente con la tarjeta */
  width: 70cqmin;
  max-width: 90%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(0);
  z-index: 10;
  will-change: opacity, transform;
  animation: stamp-fade-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

/* =========================================
   4. ANIMACIÓN DEL SLIDER (ACELERADA POR GPU)
   ========================================= */
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
