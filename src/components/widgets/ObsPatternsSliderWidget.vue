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
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()

// Datos desde Pinia
const patternsList = computed(() => store.config.patterns || [])
const slideDuration = computed(() => store.config.slideDuration || 5000)

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
    }, slideDuration.value)
  }
}

const stopSlider = () => {
  if (sliderInterval) clearInterval(sliderInterval)
}

// Reiniciar slider si cambia la lista (ej: cuando se marca uno como completado)
watch(
  patternsList,
  (newVal) => {
    if (!sliderInterval && newVal.length > 0) startSlider()
  },
  { deep: true },
)

onMounted(() => startSlider())
onUnmounted(() => stopSlider())
</script>

<style scoped>
/* Estilos originales exactos */
#patterns-slider-view {
  position: relative;
  width: 486px;
  height: 639px;
  background-color: transparent; /* Cambiado a transparente para que se vea el fondo de OBS si quieres */
  overflow: hidden;
  margin: 0;
  padding: 0;
}

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

.image-box.is-completed .main-img {
  filter: grayscale(100%) invert(100%) opacity(32%);
}

.stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  z-index: 10;
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
