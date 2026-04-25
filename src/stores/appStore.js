import { defineStore } from "pinia"
import { io } from "socket.io-client"

const SOCKET_URL = import.meta.env.DEV ? "http://localhost:3000" : window.location.origin

export const useAppStore = defineStore("app", {
  state: () => ({
    config: {
      slideDuration: 5000,
      patterns: [],
    },
    gameState: {
      markedBalls: [],
      counter: 0,
      gamePattern: [],
    },
    isConnected: false,
    socket: null,
  }),

  getters: {
    // GETTERS PARA EL HISTORIAL DE BALOTAS
    lastBall: (state) => (state.gameState.markedBalls.length > 0 ? state.gameState.markedBalls[0] : null),
    recentHistory: (state) => state.gameState.markedBalls.slice(1, 5),

    // GETTERS PARA VALIDACIÓN EN EL TABLERO
    isBallMarked: (state) => (ball) => state.gameState.markedBalls.includes(String(ball)),
    isLastMarked: (state) => (ball) => state.gameState.markedBalls[0] === String(ball),

    // GETTERS PARA MODO DE JUEGO (PATRONES)
    isPatternPositionMarked: (state) => (id) => state.gameState.gamePattern.includes(id),
  },

  actions: {
    // --- LÓGICA DE SOCKETS ---
    initSocket() {
      this.socket = io(SOCKET_URL)
      this.socket.on("connect", () => {
        this.isConnected = true
        console.log("Conectado al servidor de Bingo.")
      })
      this.socket.on("disconnect", () => {
        this.isConnected = false
        console.log("Desconectado del servidor.")
      })
      this.socket.on("initialState", (data) => {
        this.config = data.config
        this.gameState = data.gameState
      })
      this.socket.on("stateUpdated", (data) => {
        this.config = data.config
        this.gameState = data.gameState
      })
    },

    // --- SINCRONIZACIÓN BASE ---
    updateGameState(newStatePartial) {
      this.gameState = { ...this.gameState, ...newStatePartial }
      if (this.socket) {
        this.socket.emit("updateGameState", newStatePartial)
      }
    },
    updateConfig(newConfigPartial) {
      this.config = { ...this.config, ...newConfigPartial }
      if (this.socket) {
        this.socket.emit("updateConfig", newConfigPartial)
      }
    },

    // --- LÓGICA DE TABLERO DE BALOTAS ---
    toggleBall(ball) {
      const ballStr = String(ball)
      let newList = [...this.gameState.markedBalls]

      if (newList.includes(ballStr)) {
        if (newList[0] === ballStr) {
          newList.shift()
          this.updateGameState({
            markedBalls: newList,
            counter: Math.max(0, this.gameState.counter - 1),
          })
        }
      } else {
        newList.unshift(ballStr)
        this.updateGameState({
          markedBalls: newList,
          counter: this.gameState.counter + 1,
        })
      }
    },

    resetBoard() {
      this.updateGameState({ markedBalls: [], counter: 0 })
    },

    // --- LÓGICA DE MODO DE JUEGO (PATRONES) ---
    togglePatternPosition(positionId) {
      let newPattern = [...this.gameState.gamePattern]
      const index = newPattern.indexOf(positionId)

      if (index === -1) {
        newPattern.unshift(positionId)
      } else {
        newPattern.splice(index, 1)
      }

      this.updateGameState({ gamePattern: newPattern })
    },
  },
})
