import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"
import { JSONFilePreset } from "lowdb/node"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const port = 3000

// Configuración de Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Permite conexiones desde cualquier dispositivo en la red local
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "dist")))

// --- CONFIGURACIÓN DE BASE DE DATOS (LOWDB) ---
let db

async function initDatabase() {
  const dataDir = path.join(__dirname, "data")
  const dbPath = path.join(dataDir, "db.json")
  const seedPath = path.join(dataDir, "db-seed.json")

  // Crear carpeta data si no existe
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (err) {}

  // Revisar si existe db.json, si no, copiar desde el seed
  try {
    await fs.access(dbPath)
  } catch (error) {
    console.log("Creando nueva base de datos desde la semilla...")
    try {
      const seedData = await fs.readFile(seedPath, "utf-8")
      await fs.writeFile(dbPath, seedData, "utf-8")
    } catch (seedError) {
      console.error("Error al leer db-seed.json. Asegúrate de que exista.", seedError)
      process.exit(1)
    }
  }

  // Inicializar Lowdb
  const defaultData = { config: {}, gameState: {} }
  db = await JSONFilePreset(dbPath, defaultData)
  console.log("Base de datos cargada correctamente.")
}

// --- SOCKET.IO LÓGICA ---
io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`)

  // Enviar el estado actual al cliente apenas se conecta
  socket.emit("initialState", db.data)

  // Escuchar actualizaciones del estado del juego
  socket.on("updateGameState", async (newGameState) => {
    db.data.gameState = { ...db.data.gameState, ...newGameState }
    await db.write()
    // Emitir a TODOS los clientes (incluyendo al que envió el evento)
    io.emit("stateUpdated", db.data)
  })

  // Escuchar actualizaciones de configuración (ej: completar patrones)
  socket.on("updateConfig", async (newConfig) => {
    db.data.config = { ...db.data.config, ...newConfig }
    await db.write()
    io.emit("stateUpdated", db.data)
  })

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`)
  })
})

// Final Catch-All (SPA)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
})

// Arrancar servidor
initDatabase().then(() => {
  httpServer.listen(port, () => {
    console.log(`Servidor maestro escuchando en http://0.0.0.0:${port}`)
  })
})
