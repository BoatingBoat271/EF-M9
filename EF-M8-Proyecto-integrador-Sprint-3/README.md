# KanbanPro - Sprint 3

Proyecto finalizado con autenticacion JWT, API RESTful protegida y dashboard conectado a PostgreSQL con Sequelize.

## Requisitos

- Node.js 18 o superior
- PostgreSQL activo
- Archivo `.env` configurado

Variables de entorno minimas:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Kanbanpro2
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=kanbanpro_secret_sprint3
JWT_EXPIRES_IN=2h
```

## Instalacion y ejecucion

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

Aplicacion disponible en `http://localhost:3000`.

## Endpoints API (base: /api)

### Auth

- POST /api/auth/register
  - Body JSON: { "email": "usuario@mail.com", "password": "12345678" }
- POST /api/auth/login
  - Body JSON: { "email": "usuario@mail.com", "password": "12345678" }
  - Respuesta: { "ok": true, "token": "..." }

### Tableros (protegidos con Authorization: Bearer token)

- GET /api/tableros
- POST /api/tableros
  - Body JSON: { "nombre": "Mi tablero", "descripcion": "Texto" }
- PUT /api/tableros/:id
- DELETE /api/tableros/:id

### Listas (protegidas)

- POST /api/tableros/:tableroId/listas
  - Body JSON: { "nombre": "Pendiente", "orden": 1 }
- PUT /api/tableros/:tableroId/listas/:id
- DELETE /api/tableros/:tableroId/listas/:id

### Tarjetas (protegidas)

- POST /api/listas/:listaId/tarjetas
  - Body JSON: { "titulo": "Tarea", "descripcion": "Detalle", "prioridad": "Media" }
- PUT /api/listas/:listaId/tarjetas/:id
- DELETE /api/listas/:listaId/tarjetas/:id

## Uso del token

1. Registrar usuario con POST /api/auth/register.
2. Iniciar sesion con POST /api/auth/login.
3. Copiar el token recibido.
4. En Postman/Insomnia enviar header:
   Authorization: Bearer TU_TOKEN
5. Consumir rutas de tableros, listas y tarjetas.

## Dashboard con datos reales

- Ir a /login
- Iniciar sesion
- La vista redirige a /dashboard?token=...
- El servidor valida token y renderiza tableros, listas y tarjetas reales del usuario autenticado.
