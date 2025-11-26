import { ref, onMounted, onUnmounted } from 'vue';

export function useGameData(pollInterval = 1000) {
  const markedBalls = ref([]);
  const gamePattern = ref([]);
  const counter = ref(0);
  
  // NUEVO: Patrones
  const patternsList = ref([]);
  const sliderConfig = ref({ slideDuration: 5000 });
  
  const error = ref(null);
  let intervalId = null;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  const fetchData = async () => {
    try {
      const [boardRes, modeRes, patternRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/game-board-data`),
        fetch(`${API_BASE_URL}/api/game-mode-data`),
        fetch(`${API_BASE_URL}/api/patterns-data`)
      ]);

      if (!boardRes.ok || !modeRes.ok || !patternRes.ok) throw new Error('Error sync');

      const boardData = await boardRes.json();
      const modeData = await modeRes.json();
      const patternData = await patternRes.json();

      markedBalls.value = boardData.markedBalls || [];
      counter.value = boardData.counter || 0;
      gamePattern.value = modeData.gamePattern || [];
      
      patternsList.value = patternData.patterns || [];
      sliderConfig.value = patternData.config || { slideDuration: 5000 };
      
      error.value = null;
    } catch (err) {
      // console.error(err); // Descomentar para debug
      error.value = err.message;
    }
  };

  onMounted(() => {
    fetchData();
    if (pollInterval > 0) intervalId = setInterval(fetchData, pollInterval);
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return {
    markedBalls,
    gamePattern,
    counter,
    patternsList,
    sliderConfig,
    error,
    fetchData 
  };
}