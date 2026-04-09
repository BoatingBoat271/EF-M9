<h1 align="center">🚀 KanbanPro</h1>

<p align="center">
  <strong>Gestión de tareas moderna, segura y lista para escalar</strong><br>
  Plataforma Kanban full-stack con JWT, API REST y dashboard conectado a PostgreSQL.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-Ready%20for%20Demo-22C55E?style=for-the-badge" alt="estado" />
  <img src="https://img.shields.io/badge/Arquitectura-Full%20Stack-0EA5E9?style=for-the-badge" alt="arquitectura" />
  <img src="https://img.shields.io/badge/Security-JWT%20Protected-F59E0B?style=for-the-badge" alt="security" />
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-111111?style=flat-square&logo=express&logoColor=white" alt="Express"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="https://sequelize.org/"><img src="https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white" alt="Sequelize"></a>
  <a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-F59E0B?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT"></a>
</p>

---

## ✨ ¿Qué hace especial a KanbanPro?

✅ Resuelve un problema real: organización de trabajo en tableros visuales.  
✅ Tiene seguridad de nivel profesional con autenticación JWT.  
✅ Combina backend sólido + frontend funcional en una sola demo.  
✅ Se puede presentar como MVP académico o base de producto SaaS.

> 💡 En pocas palabras: no es solo una API, es una experiencia completa de producto.

---

## 🎯 Features destacadas

- 👤 Registro e inicio de sesión de usuarios
- 🔐 Protección de rutas con Bearer Token
- 🧩 CRUD completo de Tableros
- 📚 CRUD completo de Listas por tablero
- 📝 CRUD completo de Tarjetas por lista
- 📊 Dashboard con datos reales del usuario autenticado
- 🗂️ Persistencia relacional en PostgreSQL

---

## 🛠 Stack Tecnológico

| Tecnología | Rol en el proyecto |
|---|---|
| Node.js | Runtime del servidor |
| Express | Ruteo, middleware y API HTTP |
| PostgreSQL | Persistencia de datos |
| Sequelize | ORM y modelado de entidades |
| JWT | Autenticación stateless |
| bcryptjs | Hash seguro de contraseñas |
| Handlebars (hbs) | Vistas web (login y dashboard) |

---

## ⚡ Inicio rápido (60 segundos)

```bash
npm install
npm run db:create
npm run seed
npm run dev
```

### 🌐 URLs locales

- Web: http://localhost:3000
- API: http://localhost:3000/api

### 📦 Scripts disponibles

- npm run start → inicia en producción
- npm run dev → desarrollo con nodemon
- npm run db:create → crea la base de datos
- npm run seed → inserta datos iniciales
- npm run test:crud → prueba básica CRUD

---

## 🔧 Configuración de entorno

Requisitos:

- Node.js 18+
- PostgreSQL activo
- Archivo .env en la raíz

Variables de entorno mínimas:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Kanbanpro2
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=kanbanpro_secret_sprint3
JWT_EXPIRES_IN=2h
```

Tip si ejecutas comandos desde otra carpeta:

```bash
npm --prefix "c:\\Users\\pablo\\OneDrive\\Documentos\\EF-M8 Proyecto integrador Sprint 3" run dev
```

## 🚀 Instalación completa

```bash
# 1) Clonar el repositorio
git clone https://github.com/BoatingBoat271/EF-M8-Proyecto-integrador-Sprint-3.git

# 2) Entrar al proyecto
cd EF-M8-Proyecto-integrador-Sprint-3

# 3) Instalar dependencias
npm install

# 4) Crear archivo .env desde ejemplo
copy .env.example .env

# 5) Crear base de datos
npm run db:create

# 6) Cargar datos de ejemplo
npm run seed

# 7) Levantar servidor
npm run dev
```

Aplicación disponible en `http://localhost:3000`.

Demo en vivo: https://kanban-pro-pablo.onrender.com

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
