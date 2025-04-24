// server.js

import express from "express"
import bodyParser from "body-parser"
import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors" // Importa el middleware cors

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3000

app.use(cors()) // Usa el middleware cors para habilitar CORS para todas las rutas
app.use(bodyParser.json())

app.get("/api/game-data", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data.json")
    const data = await fs.readFile(filePath, "utf8")
    res.json(JSON.parse(data))
  } catch (error) {
    console.error("Error al leer data.json:", error)
    res.status(500).json({ error: "Error al leer los datos del juego" })
  }
})

app.put("/api/game-data", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data.json")
    const gameData = JSON.stringify(req.body, null, 2)
    await fs.writeFile(filePath, gameData, "utf8")
    res.json({ message: "Datos del juego guardados correctamente" })
  } catch (error) {
    console.error("Error al guardar en data.json:", error)
    res.status(500).json({ error: "Error al guardar los datos del juego" })
  }
})

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`)
})
