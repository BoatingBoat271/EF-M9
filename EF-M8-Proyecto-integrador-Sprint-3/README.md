

# 🚀 KanbanPro

¡Bienvenido/a a KanbanPro! Este proyecto es una aplicación web de gestión de tareas estilo Kanban, donde puedes organizar tu trabajo, crear tableros, listas y tarjetas, y gestionar tus tareas de manera visual y sencilla.

## 🌐 Acceso directo a la demo

👉 **[Probar KanbanPro en vivo](https://ef-m8-proyecto-integrador-sprint-3.onrender.com/)**

No necesitas instalar nada: simplemente haz clic en el enlace y explora la app. Puedes crear una cuenta, iniciar sesión y probar todas las funcionalidades.

---

## ✨ Sobre el proyecto

Este proyecto fue creado como ejercicio de desarrollo web fullstack. Incluye:

- Registro e inicio de sesión de usuarios
- Creación y gestión de tableros, listas y tarjetas
- Seguridad con autenticación JWT
- Persistencia de datos en PostgreSQL
- Interfaz visual amigable y responsive

---

## 💡 ¿Por qué KanbanPro?

KanbanPro es una herramienta útil para equipos y personas que quieren gestionar sus tareas de manera eficiente.

---

## 🔐 Flujo de autenticación

1. Registrar usuario en POST /api/auth/register
2. Iniciar sesión en POST /api/auth/login
3. Copiar el token de la respuesta
4. Enviar token en rutas protegidas:

```http
Authorization: Bearer TU_TOKEN
```

---

## 📡 Endpoints principales

### Auth

- POST /api/auth/register
  - Body: { "email": "usuario@mail.com", "password": "12345678" }
- POST /api/auth/login
  - Body: { "email": "usuario@mail.com", "password": "12345678" }
  - Response: { "ok": true, "token": "..." }

### Tableros (protegido)

- GET /api/tableros
- POST /api/tableros
- PUT /api/tableros/:id
- DELETE /api/tableros/:id

### Listas (protegido)

- POST /api/tableros/:tableroId/listas
- PUT /api/tableros/:tableroId/listas/:id
- DELETE /api/tableros/:tableroId/listas/:id

### Tarjetas (protegido)

- POST /api/listas/:listaId/tarjetas
- PUT /api/listas/:listaId/tarjetas/:id
- DELETE /api/listas/:listaId/tarjetas/:id

---

## 🧱 Estructura del proyecto

```text
EF-M8 Proyecto integrador Sprint 3/
|-- app.js
|-- create-db.js
|-- seed.js
|-- test-crud.js
|-- config/
|   `-- database.js
|-- data/
|   `-- data.json
|-- middleware/
|   `-- auth.js
|-- models/
|   |-- index.js
|   |-- Usuario.js
|   |-- Tablero.js
|   |-- Lista.js
|   `-- Tarjeta.js
|-- routes/
|   `-- api.js
|-- views/
|   |-- home.hbs
|   |-- login.hbs
|   |-- register.hbs
|   |-- dashboard.hbs
|   `-- partials/
|       |-- header.hbs
|       `-- footer.hbs
`-- public/
    `-- style.css
```

---

## 🗺️ Roadmap sugerido

- Drag & drop entre listas
- Filtros por prioridad y fecha
- Etiquetas y asignación por usuario
- Roles y permisos por equipo
- Docker + CI/CD para despliegue

---

## 👨‍💻 Autor

Proyecto desarrollado para EF-M8 Sprint 3.
