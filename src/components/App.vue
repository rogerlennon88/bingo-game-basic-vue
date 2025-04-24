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
import { ref, onMounted } from "vue"

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
    const balotasMarcadas = ref([])

    const cargarDatosIniciales = async () => {
      console.log("Intentando cargar datos iniciales desde el backend...")
      try {
        const response = await fetch("http://localhost:3000/api/game-data")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        ultimaBalota.value = data.lastBall || ""
        ultimasCuatroBalotas.value = data.lastFourBalls || []
        balotasMarcadas.value = data.markedBalls || []

        balotasMarcadas.value.forEach((balota) => {
          const boton = document.getElementById(balota)
          if (boton && !boton.classList.contains("marked")) {
            boton.classList.add("marked", "lock")
          }
        })
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error)
      }
    }

    onMounted(cargarDatosIniciales)

    const guardarDatos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/game-data", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lastBall: ultimaBalota.value,
            lastFourBalls: ultimasCuatroBalotas.value,
            markedBalls: balotasMarcadas.value,
          }),
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        console.log("Datos guardados correctamente:", result.message)
      } catch (error) {
        console.error("Error al guardar los datos:", error)
      }
    }

    const handleMarcarBalota = (balota) => {
      const balotaString = String(balota)
      ultimaBalota.value = balotaString
      ultimasCuatroBalotas.value = [balotaString, ...ultimasCuatroBalotas.value.slice(0, 4)]
      balotasMarcadas.value.push(balotaString)
      console.log(`Balota marcada en App.vue: ${balotaString}`)
      guardarDatos()
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
