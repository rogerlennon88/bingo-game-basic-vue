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

app.use(cors())
app.use(bodyParser.json())

// Servir archivos estáticos de la vista "last-number"
app.use("   ", express.static(path.join(__dirname, "views", "last-number"), { index: "index.html" }))

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
    const fileContent = await fs.readFile(filePath, "utf8");
    const gameData = JSON.parse(fileContent);
    gameData.markedBalls = req.body.markedBalls;
    const gameDataString = JSON.stringify(gameData, null, 2);
    await fs.writeFile(filePath, gameDataString, { encoding: "utf8", flag: "w" }); // Especificar encoding y flag de escritura
    res.json({ message: "Datos del tablero de juego guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar en data-game-board.json:", error);
    res.status(500).json({ error: "Error al guardar los datos del tablero de juego" });
  }
});

app.put("/api/game-board-data/counter", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-game-board.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const gameData = JSON.parse(fileContent);
    gameData.counter = (gameData.counter || 0) + 1;
    const gameDataString = JSON.stringify(gameData, null, 2);
    await fs.writeFile(filePath, gameDataString, { encoding: "utf8", flag: "w" });
    res.json({ message: "Contador actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el contador en data-game-board.json:", error);
    res.status(500).json({ error: "Error al actualizar el contador" });
  }
});

app.put("/api/game-board-data/counter/reset", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data-game-board.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const gameData = JSON.parse(fileContent);
    gameData.counter = 0;
    const gameDataString = JSON.stringify(gameData, null, 2);
    await fs.writeFile(filePath, gameDataString, { encoding: "utf8", flag: "w" });
    res.json({ message: "Contador reseteado correctamente" });
  } catch (error) {
    console.error("Error al resetear el contador en data-game-board.json:", error);
    res.status(500).json({ error: "Error al resetear el contador" });
  }
});

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

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`)
})
