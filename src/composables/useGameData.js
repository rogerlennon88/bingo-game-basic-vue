import { ref, onMounted, onUnmounted } from 'vue';

export function useGameData(pollInterval = 1000) {
  const markedBalls = ref([]);
  const gamePattern = ref([]);
  const counter = ref(0);
  const error = ref(null);
  
  let intervalId = null;

  // CORRECCIÓN CLAVE: Usamos import.meta.env y aseguramos que si no hay nada, sea ''
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  const fetchData = async () => {
    try {
      // Los console.log ayudan a depurar si la URL está mal formada
      // console.log("Fetching from:", `${API_BASE_URL}/api/game-board-data`);
      
      const [boardRes, modeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/game-board-data`),
        fetch(`${API_BASE_URL}/api/game-mode-data`)
      ]);

      if (!boardRes.ok || !modeRes.ok) {
        throw new Error('Error de sincronización con el servidor');
      }

      const boardData = await boardRes.json();
      const modeData = await modeRes.json();

      markedBalls.value = boardData.markedBalls || [];
      counter.value = boardData.counter || 0;
      gamePattern.value = modeData.gamePattern || [];
      error.value = null; // Limpiar error si tiene éxito
      
    } catch (err) {
      console.error("Polling Error:", err);
      error.value = err.message;
    }
  };

  onMounted(() => {
    fetchData();
    if (pollInterval > 0) {
      intervalId = setInterval(fetchData, pollInterval);
    }
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return {
    markedBalls,
    gamePattern,
    counter,
    error,
    fetchData 
  };
}