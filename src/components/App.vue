<template>
  <div id="container-app" :class="appClass">
    <header v-if="$route.path === '/'">
      <section id="brand">
        <img class="logo" src="/img/logo.png" alt="Aladdingo Logo" />
      </section>

      <section id="window-controls">
        <button
          class="btn btn-primary"
          @click="toggleFullscreen"
          :title="isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'"
        >
          <span class="material-icons-round">
            {{ isFullscreen ? "fullscreen_exit" : "fullscreen" }}
          </span>
        </button>
      </section>
      <section id="page-title">
        <h1>Validador de Juego</h1>
      </section>
    </header>

    <main v-if="$route.path === '/'" class="container game">
      <router-view></router-view>
    </main>

    <router-view v-else></router-view>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"

// --- LÓGICA DE INTERFAZ (Pantalla Completa) ---
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// --- RUTAS Y ESTILOS ---
const route = useRoute()

const appClass = computed(() => {
  return route.path === "/" ? "home" : "view"
})

// ¡YA NO HAY LÓGICA DE JUEGO AQUÍ!
// Todo eso se mudó a src/views/GameView.vue y src/composables/useGameData.js
</script>

<style scoped>
#container-app {
  width: 100vw;
  height: 100vh;
  display: grid;
}
#container-app.home {
  grid-template-rows: auto 1fr;
}
#container-app.view {
  /* background-color: bisque; */
  width: 1920px;
  height: 1080px;
  padding: calc(var(--gap) * 2);
  place-items: baseline;
}
</style>
