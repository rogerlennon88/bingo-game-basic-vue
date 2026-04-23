<template>
  <div class="obs-master-container">
    <div id="tray-main" class="obs-tray tray-exception">
      <div id="main-obs-fullhd-view">
        <section id="main-obs-fullhd--game-board">
          <ObsBoardWidget />
        </section>
        <section id="main-obs-fullhd--ball-cam">
          <div class="ball-cam-mod ck">ball-cam</div>
        </section>
        <section id="main-obs-fullhd--studio-cam">
          <div class="studio-cam-mod ck">studio-cam</div>
        </section>
        <section id="main-obs-fullhd--group">
          <section id="main-obs-fullhd--display-ads">
            <div class="display-ads ck">display-ads</div>
          </section>
          <section id="main-obs-fullhd--score">
            <ObsLastBallsWidget />
          </section>
        </section>
        <section id="main-obs-fullhd--prize-info">
          <div class="prize-info ck"></div>
        </section>
        <section id="main-obs-fullhd--game-mode">
          <div class="game-mode ck">game-mode</div>
        </section>
      </div>
    </div>

    <div id="tray-board-isolated" class="obs-tray">
      <div class="crop">
        <ObsBoardRefinedWidget />
      </div>
    </div>

    <div id="tray-game-mode" class="obs-tray">
      <div class="crop">
        <ObsGameModeWidget />
      </div>
    </div>

    <div id="tray-patterns" class="obs-tray">
      <div class="crop">
        <ObsPatternsSliderWidget />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useAppStore } from "../../stores/appStore"

import ObsBoardWidget from "../../components/widgets/ObsBoardWidget.vue"
import ObsBoardRefinedWidget from "../../components/widgets/ObsBoardRefinedWidget.vue"
import ObsLastBallsWidget from "../../components/widgets/ObsLastBallsWidget.vue"
import ObsGameModeWidget from "../../components/widgets/ObsGameModeWidget.vue"
import ObsPatternsSliderWidget from "../../components/widgets/ObsPatternsSliderWidget.vue"

import "../../assets/view-styles/main-obs-fullhd/main.css"

const store = useAppStore()

onMounted(() => {
  if (!store.socket) store.initSocket()
})
</script>

<style scoped>
/* CONTENEDOR MAESTRO */
.obs-master-container {
  display: flex;
  flex-direction: column;
  width: 1920px;
  background: transparent;
}

/* BANDEJAS (Trays) - Marco Cian */
.obs-tray {
  width: 1920px;
  height: 1080px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  box-sizing: border-box;

  /* Características Generales de la Bandeja */
  border: 1px solid cyan;
  padding: 8px;
}

/* EXCEPCIÓN BANDEJA 1 */
.tray-exception {
  border: none !important;
  padding: 0 !important;
  display: block;
}

/* ÁREA DE RECORTE (Crop) - Marco Magenta */
.crop {
  display: flex;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid magenta;
  padding: 4px; /* Tu margen de seguridad de 4px */
}

/* Ajuste específico para que el contenido de Bandeja 1 no se rompa */
#main-obs-fullhd-view {
  width: 100%;
  height: 100%;
  background: transparent !important;
}
</style>
