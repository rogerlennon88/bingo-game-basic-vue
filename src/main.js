// src/main.js
import "./assets/main.css"
import { createApp } from "vue"
import App from "./components/App.vue"
import router from "./router" // Importa el router

const app = createApp(App)

app.use(router) // Usa el router

// Espera a que la ruta esté lista antes de montar la aplicación
router.isReady().then(() => {
  app.mount("#app")
})
