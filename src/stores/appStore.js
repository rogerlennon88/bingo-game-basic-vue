import { defineStore } from "pinia"
import { io } from "socket.io-client"

// En desarrollo se conecta a Vite (proxy), en producción a sí mismo
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

  actions: {
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

      // Recibir datos al conectarse por primera vez
      this.socket.on("initialState", (data) => {
        this.config = data.config
        this.gameState = data.gameState
      })

      // Recibir actualizaciones en tiempo real
      this.socket.on("stateUpdated", (data) => {
        this.config = data.config
        this.gameState = data.gameState
      })
    },

    // --- ACCIONES PARA ENVIAR DATOS ---

    updateGameState(newStatePartial) {
      // Optimistic update local
      this.gameState = { ...this.gameState, ...newStatePartial }
      // Enviar al servidor
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
  },
})
