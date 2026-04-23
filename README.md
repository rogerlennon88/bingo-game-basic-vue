# 🎯 Bingo Game - Panel de Control & OBS (Vue 3 + Vite + Socket.io)

Este proyecto es la interfaz administrativa y el sistema de visualización para transmisiones de Bingo. Utiliza una arquitectura moderna de WebSockets y almacenamiento atómico local, optimizada para **despliegues en redes locales (LAN) sin necesidad de conexión a Internet**.

---

## 🛠️ Arquitectura y Tecnología

- **Frontend:** Vue 3 (Composition API) + Vite.
- **Estado Global:** Pinia (sincronizado en tiempo real).
- **Backend:** Node.js + Express.
- **Tiempo Real:** Socket.io (comunicación instantánea bidireccional).
- **Base de Datos:** Lowdb (almacenamiento local en JSON, ideal para el entorno).
- **Estructura OBS:** Técnica de *Vertical Stacking* (lienzos apilados) para optimizar recursos en el software de transmisión.

---

## ⚙️ Configuración del Proyecto

### 1. Instalación de Dependencias

Clona el repositorio y ejecuta el siguiente comando para instalar todas las dependencias del frontend y backend:

```bash
npm install
```

### 2. Base de Datos (Semilla)

El proyecto incluye un archivo data/db-seed.json que contiene la configuración inicial del tablero y los patrones.
Al ejecutar el servidor por primera vez, el sistema creará automáticamente tu base de datos de trabajo (data/db.json). Si deseas reiniciar el sistema a su estado de fábrica, simplemente borra data/db.json y vuelve a iniciar el servidor.

---

## 🛠️ Arquitectura y Tecnología


### 🚀 Comandos de Ejecución
El flujo de trabajo se divide en desarrollo y producción (el día del evento).

### 💻 Entorno de Desarrollo
Para trabajar en el código con recarga en caliente (HMR) y el servidor de WebSockets activo:

```bash
npm run dev
```

> Nota: Esto levanta Vite en el puerto 5173 y Node.js en el 3000. Vite actuará como proxy para conectar con el servidor.

### 🏭 Entorno de Producción (Mini PC / Evento en vivo)

Para desplegar la aplicación en el entorno real, primero compila el proyecto y luego inicia el servidor maestro. Node.js se encargará de servir los archivos optimizados y manejar los WebSockets en toda la red local.

```bash
# 1. Compilar el proyecto (solo es necesario si hiciste cambios en el código)
npm run build

# 2. Iniciar el servidor maestro
npm run start
```

> Nota: El sistema quedará expuesto en el puerto 3000 (http://0.0.0.0:3000), permitiendo el acceso desde cualquier dispositivo conectado a la misma red WiFi o Ethernet.

### 🌐 Endpoints y Vistas

Una vez que el servidor esté activo (ejecutando npm run start), puedes acceder a la aplicación desde el equipo principal (localhost) o desde una tablet en la red local usando la IP del servidor (ej. 192.168.1.10):

| Vista / Interfaz | URL de Acceso (Ejemplo Producción) | Propósito |
| ------------ | ------------ | ------------ |
| Dashboard Administrativo | http://localhost:3000/ | Panel de control interactivo para el animador/operador. |
| Escenario OBS (Master) | http://localhost:3000/views/obs/stage | Lienzo vertical de 1920px de ancho con bandejas apiladas. Úsalo como "Navegador" en OBS y aplica el filtro "Recortar/Acolchar" (Crop). |

### 🧩 Sistema de Bandejas OBS (Vertical Stacking)

La vista StageMaster contiene todas las escenas necesarias agrupadas verticalmente. Esto reduce el consumo de CPU/RAM en OBS.

* ***Bandeja 1 (0 a 1080px):*** Tablero principal, últimas balotas y espacio para cámaras (Chroma Key).
* ***Bandeja 2 (1081 a 2160px):*** Animación del Modo de Juego actual.
* ***Bandeja 3 (2161 a 3240px):*** Slider rotativo de los patrones disponibles y completados.