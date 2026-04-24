<template>
  <div class="obs-master-container">
    <div id="tray-board-isolated" class="obs-tray">
      <div class="crop">
        <ObsBoardRefinedWidget />
      </div>
    </div>

    <div id="tray-last-balls-isolated" class="obs-tray">
      <div class="score-grid-layout">
        <div class="left-half">
          <div class="crop crop-fill">
            <ObsMainBallRefinedWidget />
          </div>
        </div>
        <div class="right-half">
          <div class="crop crop-fill" v-for="index in 4" :key="'history-' + index">
            <ObsHistoryBallsRefinedWidget :history-index="index" />
          </div>
        </div>
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

// Widgets
import ObsBoardRefinedWidget from "../../components/widgets/ObsBoardRefinedWidget.vue"
import ObsMainBallRefinedWidget from "../../components/widgets/ObsMainBallRefinedWidget.vue"
import ObsHistoryBallsRefinedWidget from "../../components/widgets/ObsHistoryBallsRefinedWidget.vue"
import ObsGameModeWidget from "../../components/widgets/ObsGameModeWidget.vue"
import ObsPatternsSliderWidget from "../../components/widgets/ObsPatternsSliderWidget.vue"

const store = useAppStore()

onMounted(() => {
  if (!store.socket) {
    store.initSocket()
  }
})
</script>

<style scoped>
/* ESTRUCTURA MAESTRA:
   Lienzo vertical puro de 1920px de ancho.
*/
.obs-master-container {
  display: flex;
  flex-direction: column;
  width: 1920px;
  background: transparent;
  margin: 0;
  padding: 0;
}

/* BANDEJAS (Trays):
   Cada una mide exactamente 1080px de alto. 
   Sin bordes ni paddings que alteren la posición de los píxeles.
*/
.obs-tray {
  width: 1920px;
  height: 1080px;
  padding: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  box-sizing: border-box;
  overflow: hidden;
}

/* CROP STANDARD:
   Abraza el contenido. Usamos magenta solo como guía visual temporal.
*/
.crop {
  display: flex;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid magenta; /* Guía para OBS */
  padding: 4px;
}

/* CROP FILL:
   Para que el widget ocupe todo el espacio del grid asignado.
*/
.crop-fill {
  width: 100%;
  height: 100%;
}

/* GRID LAYOUT PARA EL MARCADOR (TRAY 2) */
.score-grid-layout {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0; /* Pegados uno al otro */
}

.left-half,
.right-half {
  width: 100%;
  height: 100%;
}

.right-half {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0;
}
</style>
