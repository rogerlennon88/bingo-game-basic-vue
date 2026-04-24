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

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// --- AJUSTE RECOMENDADO: MANEJO DE ARCHIVOS ESTÁTICOS ---
const distPath = path.join(__dirname, "dist")

// Servir archivos estáticos si la carpeta 'dist' existe (Modo Producción)
app.use(express.static(distPath))

let db

/**
 * Initializes the database by checking for existence and seeding if necessary.
 */
async function initDatabase() {
  const dataDirectory = path.join(__dirname, "data")
  const dbPath = path.join(dataDirectory, "db.json")
  const seedPath = path.join(dataDirectory, "db-seed.json")

  try {
    await fs.mkdir(dataDirectory, { recursive: true })
  } catch (err) {
    // Directory already exists
  }

  try {
    await fs.access(dbPath)
  } catch (error) {
    console.log("⚠️ Base de datos no encontrada. Creando desde semilla...")
    try {
      const seedData = await fs.readFile(seedPath, "utf-8")
      await fs.writeFile(dbPath, seedData, "utf-8")
    } catch (seedError) {
      console.error("❌ Error crítico: No se encontró db-seed.json.", seedError)
      process.exit(1)
    }
  }

  const defaultData = { config: {}, gameState: {} }
  db = await JSONFilePreset(dbPath, defaultData)
  console.log("✅ Base de datos cargada correctamente.")
}

// --- LÓGICA DE WEBSOCKETS ---
io.on("connection", (socket) => {
  console.log(`📡 Nuevo cliente conectado: ${socket.id}`)

  // Enviar estado inicial al conectar
  socket.emit("initialState", db.data)

  // Escuchar actualizaciones del estado de juego
  socket.on("updateGameState", async (newGameState) => {
    db.data.gameState = { ...db.data.gameState, ...newGameState }
    await db.write()
    io.emit("stateUpdated", db.data)
  })

  // Escuchar actualizaciones de configuración
  socket.on("updateConfig", async (newConfig) => {
    db.data.config = { ...db.data.config, ...newConfig }
    await db.write()
    io.emit("stateUpdated", db.data)
  })

  socket.on("disconnect", () => {
    console.log(`🔌 Cliente desconectado: ${socket.id}`)
  })
})

// --- FALLBACK PARA SINGLE PAGE APPLICATION (SPA) ---
app.get("*", (req, res, next) => {
  // Si la petición es para Socket.io o API, ignorar el fallback
  if (req.path.startsWith("/socket.io") || req.path.startsWith("/api")) {
    return next()
  }

  const indexPath = path.join(distPath, "index.html")

  res.sendFile(indexPath, (err) => {
    if (err) {
      // En desarrollo (sin carpeta dist), mostramos un mensaje informativo amigable
      res.status(404).send(`
        <h1>Entorno de Desarrollo Bingo</h1>
        <p>El servidor de datos (Puerto 3000) está activo.</p>
        <p>Para ver la interfaz con cambios en tiempo real, accede a: 
           <a href="http://localhost:5173">http://localhost:5173</a>
        </p>
      `)
    }
  })
})

// --- ARRANQUE DEL SERVIDOR ---
initDatabase().then(() => {
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`==================================================`)
    console.log(`🚀 SERVIDOR BINGO ACTIVO`)
    console.log(`==================================================`)
    console.log(`▶ Backend & Sockets: http://localhost:${port}`)
    console.log(`▶ Frontend (Producción): http://localhost:${port}`)
    console.log(`▶ Frontend (Desarrollo): http://localhost:5173`)
    console.log(`==================================================`)
    console.log(`Instrucción: Para desarrollo con HMR usa el puerto 5173.`)
  })
})
