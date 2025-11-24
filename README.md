# 📝 Bingo Game - Validador (Vue 3 + Vite)

Este proyecto es la interfaz administrativa y de visualización del sistema de Bingo. Utiliza una arquitectura optimizada para el **despliegue en entornos locales y sin conexión a Internet**.

---

## 🛠️ Arquitectura y Tecnología

- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **Backend:** Node.js / Express (servido desde el mismo origen/puerto)
- **Estado:** Centralizado mediante **Composables** (`useGameData.js`) para garantizar la sincronización en tiempo real de todas las pantallas (Administración, Contador, Proyección, etc.) con una única fuente de verdad (el backend).
- **Entorno:** Diseñado para ejecutarse en un Mini PC (servidor) y accederse desde dispositivos en la misma red local (tablets/proyectores).

---

## ⚙️ Configuración del Proyecto

### 1\. Instalación de Dependencias

Ejecuta el comando para instalar todas las dependencias del proyecto:

Bash

```
npm install
```

### 2\. Variables de Entorno

El proyecto está configurado para usar **rutas relativas** en producción, lo que significa que el Frontend busca la API en el mismo puerto y dirección desde donde fue cargado.

- **Desarrollo:** Usa el proxy de Vite para redirigir peticiones de `5173` a `3000`.
- **Producción (Mini PC):** El Backend (Node.js) sirve el Frontend (carpeta `dist/`) desde el puerto `3000`.

---

## 🚀 Comandos de Ejecución

### 💻 1. Desarrollo (Development)

Para trabajar localmente (con HMR - Hot Module Replacement) y el servidor de la API activos.

Bash

```
# Ejecuta Vite (Frontend) y Node.js (Backend) al mismo tiempo
npm run dev
```

> **Nota:** El Frontend estará en `http://localhost:5173` y usará el proxy para hablar con el Backend en `http://localhost:3000`.

### 🏭 2. Producción / Despliegue (Production/Mini PC)

Este es el comando que debe usarse en el Mini PC. Primero compila el Frontend y luego inicia el servidor Node.js que sirve los archivos estáticos (`dist/`).

Bash

```
# Primero compila, luego inicia el servidor backend (Mini PC)
npm run build && npm run backend
```

---

## 🌐 Endpoints de Visualización

Una vez que el servidor esté activo en el Mini PC (ej: IP **`192.168.1.10`**), la aplicación puede ser accedida por cualquier dispositivo en la red:

| Vista              | URL de Acceso                                    | Propósito                     |
| ------------------ | ------------------------------------------------ | ----------------------------- |
| **Administración** | `http://192.168.1.10:3000/`                      | Control del juego (Tablet/PC) |
| **Proyección**     | `http://192.168.1.10:3000/views/main-obs-fullhd` | Salida para OBS/Proyector     |
| **Tablero**        | `http://192.168.1.10:3000/views/game-board`      | Vista detallada del tablero   |

---

## 🛠️ Configuración de Entorno

### IDE Recomendado

**[VSCode](https://code.visualstudio.com/)** + **[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)** (y desactivar Vetur).

### Personalizar Configuración

Ver [Vite Configuration Reference](https://vite.dev/config/).
