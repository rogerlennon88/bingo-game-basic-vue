// server.js

import express from "express"
import bodyParser from "body-parser"
import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = 3000

// CORS ya no es estrictamente necesario si usamos el mismo origen,
// pero es buena práctica dejarlo por seguridad.
app.use(cors())
app.use(bodyParser.json())

// 1. Servir archivos estáticos (JS, CSS, Imágenes)
app.use(express.static(path.join(__dirname, "dist")))

// --- RUTAS API (Siempre deben ir ANTES del catch-all) ---

// Rutas para GameBoard data
app.get("/api/game-board-data", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-game-board.json")
    const data = await fs.readFile(filePath, "utf8")
    res.json(JSON.parse(data))
  } catch (error) {
    console.error("Error al leer data-game-board.json:", error)
    res.status(500).json({ error: "Error al leer los datos del tablero de juego" })
  }
})

app.put("/api/game-board-data", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-game-board.json")
    const fileContent = await fs.readFile(filePath, "utf8")
    const gameData = JSON.parse(fileContent)
    gameData.markedBalls = req.body.markedBalls
    const gameDataString = JSON.stringify(gameData, null, 2)
    await fs.writeFile(filePath, gameDataString, { encoding: "utf8", flag: "w" })
    res.json({ message: "Datos del tablero de juego guardados correctamente" })
  } catch (error) {
    console.error("Error al guardar en data-game-board.json:", error)
    res.status(500).json({ error: "Error al guardar los datos del tablero de juego" })
  }
})

app.put("/api/game-board-data/counter", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-game-board.json")
    const fileContent = await fs.readFile(filePath, "utf8")
    const gameData = JSON.parse(fileContent)
    gameData.counter = (gameData.counter || 0) + 1
    const gameDataString = JSON.stringify(gameData, null, 2)
    await fs.writeFile(filePath, gameDataString, { encoding: "utf8", flag: "w" })
    res.json({ message: "Contador actualizado correctamente" })
  } catch (error) {
    console.error("Error al actualizar el contador en data-game-board.json:", error)
    res.status(500).json({ error: "Error al actualizar el contador" })
  }
})

app.delete("/api/game-board-data/counter", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-game-board.json")
    const fileContent = await fs.readFile(filePath, "utf8")
    const gameData = JSON.parse(fileContent)
    gameData.counter = Math.max(0, (gameData.counter || 0) - 1)
    const gameDataString = JSON.stringify(gameData, null, 2)
    await fs.writeFile(filePath, gameDataString, { encoding: "utf8", flag: "w" })
    res.json({ message: "Contador disminuido correctamente" })
  } catch (error) {
    console.error("Error al disminuir el contador en data-game-board.json:", error)
    res.status(500).json({ error: "Error al disminuir el contador" })
  }
})

app.put("/api/game-board-data/counter/reset", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-game-board.json")
    const fileContent = await fs.readFile(filePath, "utf8")
    const gameData = JSON.parse(fileContent)
    gameData.counter = 0
    const gameDataString = JSON.stringify(gameData, null, 2)
    await fs.writeFile(filePath, gameDataString, { encoding: "utf8", flag: "w" })
    res.json({ message: "Contador reseteado correctamente" })
  } catch (error) {
    console.error("Error al resetear el contador en data-game-board.json:", error)
    res.status(500).json({ error: "Error al resetear el contador" })
  }
})

// Rutas para GameMode data
app.get("/api/game-mode-data", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-game-mode.json")
    const data = await fs.readFile(filePath, "utf8")
    res.json(JSON.parse(data))
  } catch (error) {
    console.error("Error al leer data-game-mode.json:", error)
    res.status(500).json({ error: "Error al leer los datos del modo de juego" })
  }
})

app.put("/api/game-mode-data", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-game-mode.json")
    const gameModeData = JSON.stringify(req.body, null, 2)
    await fs.writeFile(filePath, gameModeData, "utf8")
    res.json({ message: "Datos del modo de juego guardados correctamente" })
  } catch (error) {
    console.error("Error al guardar en data-game-mode.json:", error)
    res.status(500).json({ error: "Error al guardar los datos del modo de juego" })
  }
})

// --- RUTAS DE PATRONES (SLIDER) ---
const fsPromises = fs // Asegúrate de usar fs.promises o la importación que ya tenías

app.get("/api/patterns-data", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-patterns.json")
    const data = await fsPromises.readFile(filePath, "utf8")
    res.json(JSON.parse(data))
  } catch (error) {
    console.error("Error al leer data-patterns.json:", error)
    res.json({ config: { slideDuration: 5000 }, patterns: [] })
  }
})

app.put("/api/patterns-data/:id", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-patterns.json")
    const fileContent = await fsPromises.readFile(filePath, "utf8")
    const db = JSON.parse(fileContent)

    const patternId = parseInt(req.params.id)
    const patternIndex = db.patterns.findIndex((p) => p.id === patternId)

    if (patternIndex !== -1) {
      db.patterns[patternIndex].completed = !db.patterns[patternIndex].completed
      await fsPromises.writeFile(filePath, JSON.stringify(db, null, 2), "utf8")
      res.json({ message: "Estado actualizado", pattern: db.patterns[patternIndex] })
    } else {
      res.status(404).json({ error: "Patrón no encontrado" })
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno" })
  }
})

app.put("/api/patterns-data/reset", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-patterns.json")
    const fileContent = await fsPromises.readFile(filePath, "utf8")
    const db = JSON.parse(fileContent)

    db.patterns = db.patterns.map((p) => ({ ...p, completed: false }))

    await fsPromises.writeFile(filePath, JSON.stringify(db, null, 2), "utf8")
    res.json({ message: "Reset completo" })
  } catch (error) {
    res.status(500).json({ error: "Error al resetear" })
  }
})

// --- FINAL CATCH-ALL (SPA) ---
// Usamos app.use sin ruta específica, Express lo ejecuta si ninguna ruta anterior coincidió.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`)
})
