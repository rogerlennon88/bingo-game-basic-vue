<template>
  <div>
    <header>
      <section id="brand">
        <img class="logo" src="/public/img/logo.png" alt="Aladdingo Logo" />
      </section>
      <section id="page-title">
        <h1>Validador de Juego</h1>
      </section>
    </header>
    <main class="container game">
      <section class="block">
        <GameBoard @marcar-balota="handleMarcarBalota"></GameBoard>
      </section>
      <section class="block">
        <LastNumber :ultimaBalota="ultimaBalota"></LastNumber>
        <LastNumberList :lastFourBalls="ultimasCuatroBalotas"></LastNumberList>
      </section>
    </main>
  </div>
</template>

<script>
import GameBoard from "./modules/GameBoard.vue"
import LastNumber from "./modules/LastNumber.vue"
import LastNumberList from "./modules/LastNumberList.vue"
import { ref } from "vue"

export default {
  name: "App",
  components: {
    GameBoard,
    LastNumber,
    LastNumberList,
  },
  setup() {
    const ultimaBalota = ref("")
    const ultimasCuatroBalotas = ref([])

    const handleMarcarBalota = (balota) => {
      const balotaString = String(balota) // Convertimos la balota a string
      ultimaBalota.value = balotaString
      ultimasCuatroBalotas.value = [balotaString, ...ultimasCuatroBalotas.value.slice(0, 4)]
      console.log(`Balota marcada en App.vue: ${balotaString}`)
      // Aquí iría la lógica para actualizar el archivo data.json
    }

    return {
      ultimaBalota,
      ultimasCuatroBalotas,
      handleMarcarBalota,
    }
  },
}
</script>

<style scoped></style>
