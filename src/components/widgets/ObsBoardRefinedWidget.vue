<template>
  <div id="game-board-refined" class="board-refined-container">
    <header class="board-header">
      <div v-for="column in tableroData" :key="'h-' + column[0].id" class="header-cell">
        <span class="letter-text">{{ column[0].value }}</span>
      </div>
    </header>

    <main class="board-body">
      <div v-for="column in tableroData" :key="'c-' + column[0].id" class="body-column">
        <div v-for="cell in column.slice(1)" :key="cell.id" class="num-cell">
          <span
            class="num-text"
            :class="{
              marked: isBalotaMarcada(cell.value),
              'marked-animating': isAnimating(cell.value),
              lock: isBalotaMarcada(cell.value),
            }"
          >
            {{ cell.value }}
          </span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useAppStore } from "../../stores/appStore"

const store = useAppStore()
const markedBalls = computed(() => store.gameState.markedBalls)

const letters = ["B", "I", "N", "G", "O"]
const numbersPerColumn = 15
const tableroData = ref([])
const animatingBalls = ref([])
const animationDuration = 2000

watch(
  markedBalls,
  (newVal, oldVal) => {
    if (!oldVal || oldVal.length === 0) return
    const newBalls = newVal.filter((ball) => !oldVal.includes(ball))
    newBalls.forEach((ball) => {
      if (!animatingBalls.value.includes(ball)) {
        animatingBalls.value.push(ball)
        setTimeout(() => {
          animatingBalls.value = animatingBalls.value.filter((b) => b !== ball)
        }, animationDuration)
      }
    })
  },
  { deep: true },
)

const generateTableroData = () => {
  const data = []
  for (let i = 0; i < 5; i++) {
    const column = [{ type: "letter", value: letters[i], id: `${letters[i]}-ggb` }]
    for (let j = 1; j <= numbersPerColumn; j++) {
      column.push({ type: "number", value: i * numbersPerColumn + j, id: i * numbersPerColumn + j })
    }
    data.push(column)
  }
  tableroData.value = data
}

const isBalotaMarcada = (balota) => markedBalls.value.includes(String(balota))
const isAnimating = (balota) => animatingBalls.value.includes(String(balota))

onMounted(() => generateTableroData())
</script>

<style scoped>
/* =========================================
   CONTENEDOR MAESTRO DEL TABLERO
   ========================================= */
.board-refined-container {
  /* height: 100%; */
  display: grid;
  grid-template-rows: auto 1fr; /* Encabezado usa lo que necesita, Cuerpo usa el resto */
  gap: 8px;
  /* background: #ce004f; */
  padding: 16px;
  border-radius: 24px; /* Suaviza las esquinas del fondo principal */
  font-family: "Aktiv Grotesk Ex Trial XBold", Arial, sans-serif;
  transform: translateZ(0); /* Aceleración por hardware para OBS */
}

/* =========================================
   ENCABEZADO (Letras B-I-N-G-O)
   ========================================= */
.board-header {
  background-color: inherit;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  padding: 0;
  align-items: inherit;
}

.header-cell {
  /* [CRÍTICO] Ruta absoluta apuntando a la carpeta public de Vite */
  background-image: url("/views-media/main-obs-fullhd/bg-btn-letter.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: grid;
  place-items: center;
}

.letter-text {
  font-size: 6rem; /* Excelente uso de viewport units */
  font-weight: 900;
  color: #64043f;
  line-height: 1;
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 1; /* Garantiza proporciones cuadradas perfectas */
  padding: 8px;
  width: 100%; /* Asegura que el texto interactúe con toda la celda */
}

/* =========================================
   CUERPO (Grid de Balotas)
   ========================================= */
.board-body {
  background: #64043f;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  border: 3px solid #64043f;
  border-radius: 16px;
  overflow: clip; /* Moderno y eficiente para bordes redondeados */
}

.body-column {
  display: grid;
  grid-template-rows: repeat(15, 1fr); /* 15 celdas de igual tamaño */
  gap: 3px;
}

.num-cell {
  background-color: #fbfcfc;
  border-radius: 2px;
  overflow: clip;
}

.num-text {
  /* Usamos width y height al 100% en lugar de padding fijo para 
     evitar que el tablero se desborde del límite de 1080px */
  /* width: 100%; */
  /* height: 100%; */
  padding: 10px 20px;
  font-size: 3.8rem;
  font-weight: 700;
  color: #64043f80;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  display: grid;
  place-items: center;
  transition: all 0.2s ease; /* Transición suave al marcar */
}

/* =========================================
   ESTADOS DINÁMICOS (Marcada y Animación)
   ========================================= */
.num-text.marked {
  /* [CRÍTICO] Ruta absoluta apuntando a la carpeta public */
  background-image: url("/views-media/main-obs-fullhd/bg-btn-num.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 72%;
  color: #fdfefe;
  cursor: default;
}

.marked-animating {
  animation: num-pulse 0.6s alternate infinite;
}

@keyframes num-pulse {
  from {
    transform: scale(1);
    filter: brightness(1);
  }
  to {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
}

.num-text.marked-animating {
  /* Mantenemos tu imagen de fondo intacta durante la animación */
  background-image: url(/views-media/main-obs-fullhd/bg-btn-num.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 72%;
  background-color: #e97451;
  color: #fff;

  /* Agregamos el destello/parpadeo que funciona sobre tu arte */
  animation: obs-ball-pop 0.5s alternate infinite ease-in-out;
}

@keyframes obs-ball-pop {
  0% {
    filter: brightness(1);
    transform: scale(1);
  }
  100% {
    background-color: rgb(255, 213, 128);
    color: rgb(192, 64, 0);
    box-shadow: inset 0 0 16px 1px rgb(255, 95, 31);

    filter: brightness(1.3) drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
    transform: scale(1.05);
  }
}
</style>
