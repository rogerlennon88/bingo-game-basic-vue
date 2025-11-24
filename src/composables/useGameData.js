// src/composables/useGameData.js
import { ref, onMounted, onUnmounted } from "vue"

export function useGameData(pollInterval = 1000) {
  // Estado Reactivo Centralizado
  const markedBalls = ref([])
  const gamePattern = ref([])
  const counter = ref(0)
  const error = ref(null)

  let intervalId = null
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  // Función para traer datos (GameBoard y GameMode al tiempo)
  const fetchData = async () => {
    try {
      const [boardRes, modeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/game-board-data`),
        fetch(`${API_BASE_URL}/api/game-mode-data`),
      ])

      if (!boardRes.ok || !modeRes.ok) {
        throw new Error("Error de sincronización con el servidor")
      }

      const boardData = await boardRes.json()
      const modeData = await modeRes.json()

      // Actualizamos el estado
      markedBalls.value = boardData.markedBalls || []
      counter.value = boardData.counter || 0
      gamePattern.value = modeData.gamePattern || []
    } catch (err) {
      console.error("Polling Error:", err)
      error.value = err.message
    }
  }

  // Ciclo de vida: Iniciar polling al montar, detener al salir
  onMounted(() => {
    fetchData() // Carga inmediata inicial
    if (pollInterval > 0) {
      intervalId = setInterval(fetchData, pollInterval)
    }
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  // Retornamos las referencias y la función fetchData por si queremos recargar manualmente
  return {
    markedBalls,
    gamePattern,
    counter,
    error,
    fetchData,
  }
}
