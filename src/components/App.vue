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

const route = useRoute()
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

// Determinamos si es una ruta de OBS
const isObsRoute = computed(() => route.path.startsWith("/views/obs/"))

const appClass = computed(() => {
  if (route.path === "/") return "home"
  if (isObsRoute.value) return "obs-view"
  return "standard-view"
})
</script>

<style scoped>
#container-app {
  width: 100vw;
  height: 100vh;
  display: grid;
  background: transparent;
}

#container-app.home {
  grid-template-rows: auto 1fr;
}

/* Solo aplica para el lienzo de OBS */
#container-app.obs-view {
  width: 1920px;
  height: auto; /* Alto infinito para stacking vertical */
  padding: 0;
  margin: 0;
  place-items: start;
  overflow-x: hidden;
}

/* Para otras vistas futuras que no sean OBS ni Dashboard */
#container-app.standard-view {
  padding: calc(var(--gap) * 2);
  place-items: center;
}
</style>