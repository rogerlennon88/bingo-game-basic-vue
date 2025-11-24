<template>
  <div id="game-board-view">
    <GameBoard :initialMarkedBalls="markedBalls" @marcar-balota="handleMarcarBalota" />
  </div>
</template>

<script setup>
import { useGameData } from "../composables/useGameData"
import GameBoard from "../components/modules/GameBoard.vue"

// Usamos el composable
const { markedBalls, fetchData: recargarDatos } = useGameData(1000)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

// Manejador simple para marcar (opcional, si esta vista es interactiva)
const handleMarcarBalota = async (balota) => {
  const balotaString = String(balota)
  if (!markedBalls.value.includes(balotaString)) {
    const nuevoArray = [balotaString, ...markedBalls.value]
    try {
      await fetch(`${API_BASE_URL}/api/game-board-data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markedBalls: nuevoArray }),
      })
      await recargarDatos()
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style scoped>
#game-board-view {
  display: grid;
  place-items: center;
  height: 100%;
  padding: 20px;
}
</style>
