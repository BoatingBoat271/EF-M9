# KanbanPro

Proyecto correspondiente a EF- M7 Proyecto integrador Sprint 2.

Este repositorio mantiene el prototipo visual del Sprint 1 (Express + Handlebars + JSON) y agrega, de forma desacoplada, la capa de persistencia del Sprint 2 con PostgreSQL y Sequelize.

## Objetivo del Sprint 2

Construir el modelo de datos y probarlo en scripts de Node.js (sin conectar todavia estas operaciones a las rutas de Express):

- Modelos: Usuario, Tablero, Lista y Tarjeta.
- Relaciones 1:N:
	- Usuario -> Tablero
	- Tablero -> Lista
	- Lista -> Tarjeta
- Script de poblado de base de datos.
- Script de verificacion CRUD aislado.

## Estructura relevante

- app.js
- config/database.js
- models/
	- Usuario.js
	- Tablero.js
	- Lista.js
	- Tarjeta.js
	- index.js
- seed.js
- test-crud.js
- data/data.json
- views/
- public/

## Requisitos previos

- Node.js 18 o superior.
- PostgreSQL instalado y activo.

Si no tienes `psql` en PATH, puedes crear la base desde Node:

```bash
npm run db:create
```

## Configuracion de entorno

1. Copiar el archivo `.env.example` a `.env` (o editar el `.env` existente).
2. Completar credenciales reales de PostgreSQL.

Variables esperadas:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Kanbanpro2
DB_USER=postgres
DB_PASSWORD=postgres
```

## Instalacion

```bash
# 1) Clonar el repositorio
git clone https://github.com/BoatingBoat271/EF--M7-Proyecto-integrador-Sprint-2.git

# 2) Entrar al proyecto
cd EF--M7-Proyecto-integrador-Sprint-2

# 3) Instalar dependencias
npm install
```

Dependencias principales del sprint:

- sequelize
- pg
- pg-hstore
- dotenv

## Ejecucion Sprint 2 (Base de datos)

1. Crear base de datos (si aun no existe):

```bash
npm run db:create
```

2. Poblar la base de datos (crea tablas y carga datos de ejemplo):

```bash
npm run seed
```

3. Ejecutar pruebas CRUD aisladas:

```bash
npm run test:crud
```

Este flujo prueba:

- Crear: nueva tarjeta asociada a una lista existente.
- Leer: tablero con listas y tarjetas usando `include`.
- Actualizar: titulo de tarjeta.
- Borrar: eliminacion de tarjeta.

## Ejecucion Sprint 1 (UI sin cambios)

La aplicacion web sigue funcionando con datos simulados en JSON:

```bash
npm run dev
```

o

```bash
npm start
```

Rutas disponibles:

- /
- /register
- /login
- /dashboard

## API REST basica (Sprint 2)

Se agregaron rutas REST simples para trabajar con Sequelize sin afectar las vistas.

Base URL:

```text
http://localhost:3000/api
```

Endpoints:

- GET `/api/health`
- GET `/api/usuarios`
- POST `/api/usuarios`
- PUT `/api/usuarios/:id`
- DELETE `/api/usuarios/:id`
- GET `/api/tableros`
- POST `/api/tableros`
- PUT `/api/tableros/:id`
- DELETE `/api/tableros/:id`
- GET `/api/listas`
- POST `/api/listas`
- PUT `/api/listas/:id`
- DELETE `/api/listas/:id`
- POST `/api/tarjetas`
- PUT `/api/tarjetas/:id`
- DELETE `/api/tarjetas/:id`

Ejemplo body para crear tarjeta:

```json
{
	"titulo": "Nueva tarea",
	"descripcion": "Detalle de la tarea",
	"prioridad": "Media",
	"listaId": 1
}
```

Notas:

- Estas rutas usan datos de PostgreSQL (no `data/data.json`).
- La UI de Sprint 1 sigue operando con JSON local para mantener el desacoplamiento.

## Notas

- En este sprint no se modifico la funcionalidad visual existente.
- La capa de Sequelize se desarrollo en scripts separados para validar integridad del modelo antes de exponer API.