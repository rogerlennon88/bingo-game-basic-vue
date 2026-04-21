<template>
  <div class="obs-master-container">
    <div class="obs-tray">
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

    <div class="obs-tray tray-center">
      <ObsGameModeWidget />
    </div>

    <div class="obs-tray tray-center">
      <ObsPatternsSliderWidget />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useAppStore } from "../../stores/appStore"

import ObsBoardWidget from "../../components/widgets/ObsBoardWidget.vue"
import ObsLastBallsWidget from "../../components/widgets/ObsLastBallsWidget.vue"
import ObsGameModeWidget from "../../components/widgets/ObsGameModeWidget.vue"
import ObsPatternsSliderWidget from "../../components/widgets/ObsPatternsSliderWidget.vue"

import "../../assets/view-styles/main-obs-fullhd/main.css"

const store = useAppStore()

onMounted(() => {
  if (!store.socket) {
    store.initSocket()
  }
})
</script>

<style scoped>
.obs-master-container {
  display: flex;
  flex-direction: column;
  width: 1920px;
  background-color: transparent;
}

.obs-tray {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  background-color: transparent;
}

.tray-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
