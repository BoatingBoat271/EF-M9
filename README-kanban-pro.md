# Kanban Pro 📋

![Kanban Pro Demo](portfolio/assets/img/kanban-pro-demo.svg)

> Aplicación fullstack de gestión de tareas estilo Kanban con tableros, columnas y persistencia de datos en base de datos relacional.

---

## Demo en vivo

🔗 **[Ver demo en vivo](https://kanban-pro-pablo.onrender.com)**

---

## Descripción

Kanban Pro es una aplicación fullstack que permite organizar tareas visualmente en columnas (Por hacer / En progreso / Completado). A diferencia de soluciones basadas solo en `localStorage`, esta app cuenta con un backend propio en Node.js, una API REST y persistencia real en PostgreSQL.

**Funcionalidades principales:**
- Crear, editar y eliminar tareas
- Mover tareas entre columnas con drag & drop
- Persistencia de datos en base de datos
- API REST propia consumida desde el frontend
- Diseño responsive

---

## Tecnologías utilizadas

| Capa        | Tecnología              |
|-------------|-------------------------|
| Frontend    | React, CSS3             |
| Backend     | Node.js, Express        |
| Base de datos | PostgreSQL            |
| API         | REST (JSON)             |

---

## Instalación y uso

### Requisitos previos
- Node.js v18 o superior
- PostgreSQL instalado y corriendo

### 1. Clonar el repositorio

```bash
git clone https://github.com/BoatingBoat271/EF-M8-Proyecto-integrador-Sprint-3.git
cd EF-M8-Proyecto-integrador-Sprint-3
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend/`:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/kanban_db
```

Ejecuta las migraciones o el script SQL para crear las tablas:

```bash
psql -U usuario -d kanban_db -f database/schema.sql
```

Inicia el servidor:

```bash
npm run dev
```

### 3. Configurar el frontend

```bash
cd ../frontend
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

---

## Variables de entorno

| Variable       | Descripción                          |
|----------------|--------------------------------------|
| `PORT`         | Puerto del servidor backend          |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL      |

> Nunca subas el archivo `.env` a GitHub. Incluye `.env` en tu `.gitignore`.

---

## Estructura del proyecto

```
kanban-pro/
├── frontend/           # Aplicación React
│   ├── src/
│   └── package.json
├── backend/            # API REST con Node.js + Express
│   ├── routes/
│   ├── controllers/
│   ├── database/
│   └── package.json
└── README.md
```

---

## Autor

**Pablo** — [GitHub](https://github.com/TU_USUARIO) · [LinkedIn](https://linkedin.com/in/TU_USUARIO) · [Portfolio](TU_LINK_PORTFOLIO)
