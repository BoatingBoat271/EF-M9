require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { sequelize, Tablero, Lista, Tarjeta } = require('./models');
const JWT_SECRET = process.env.JWT_SECRET || 'kanbanpro_secret_sprint3';

const app = express();
const PORT = process.env.PORT || 3000;
const apiRoutes = require('./routes/api');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const partialsDir = path.join(__dirname, 'views', 'partials');
fs.readdirSync(partialsDir).forEach(function (filename) {
  const match = /^([^.]+)\.hbs$/.exec(filename);
  if (!match) return;
  const name = match[1];
  const template = fs.readFileSync(path.join(partialsDir, filename), 'utf-8');
  hbs.registerPartial(name, template);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

function getUsuarioDesdeToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

async function cargarTablerosUsuario(usuarioId) {
  return Tablero.findAll({
    where: { usuarioId },
    include: [
      {
        model: Lista,
        as: 'listas',
        include: [{ model: Tarjeta, as: 'tarjetas' }]
      }
    ],
    order: [
      ['id', 'ASC'],
      [{ model: Lista, as: 'listas' }, 'orden', 'ASC'],
      [{ model: Lista, as: 'listas' }, { model: Tarjeta, as: 'tarjetas' }, 'id', 'ASC']
    ]
  });
}

async function asegurarTableroInicial(usuarioId) {
  const cantidadTableros = await Tablero.count({ where: { usuarioId } });
  if (cantidadTableros > 0) {
    return;
  }

  const tableroInicial = await Tablero.create({
    nombre: 'Mi primer tablero',
    descripcion: 'Tablero inicial creado automaticamente',
    usuarioId
  });

  await Lista.bulkCreate([
    { nombre: 'Pendiente', orden: 1, tableroId: tableroInicial.id },
    { nombre: 'En progreso', orden: 2, tableroId: tableroInicial.id },
    { nombre: 'Completado', orden: 3, tableroId: tableroInicial.id }
  ]);
}

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/dashboard', async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redireccionando...</title>
</head>
<body>
  <script>
    (function () {
      var tokenGuardado = localStorage.getItem('kanbanpro_token');
      if (tokenGuardado) {
        window.location.replace('/dashboard?token=' + encodeURIComponent(tokenGuardado));
      } else {
        window.location.replace('/login');
      }
    })();
  </script>
</body>
</html>
      `);
    }

    const usuario = getUsuarioDesdeToken(token);
    if (!usuario) {
      return res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sesion expirada</title>
</head>
<body>
  <script>
    localStorage.removeItem('kanbanpro_token');
    window.location.replace('/login');
  </script>
</body>
</html>
      `);
    }

    await asegurarTableroInicial(usuario.id);
    const tableros = await cargarTablerosUsuario(usuario.id);

    return res.render('dashboard', {
      token,
      tableros,
      usuarioEmail: usuario.email
    });
  } catch (error) {
    console.error('Error al cargar dashboard:', error.message);
    return res.status(500).send('Error interno: no se pudo cargar el dashboard.');
  }
});

app.post('/dashboard/tarjetas', async (req, res) => {
  try {
    const { token, titulo, descripcion, prioridad, listaId } = req.body;

    const usuario = getUsuarioDesdeToken(token);
    if (!usuario) {
      return res.redirect('/login');
    }

    if (!titulo || !listaId) {
      return res.redirect('/dashboard?token=' + encodeURIComponent(token));
    }

    const lista = await Lista.findOne({
      where: { id: listaId },
      include: [
        {
          model: Tablero,
          as: 'tablero',
          where: { usuarioId: usuario.id }
        }
      ]
    });

    if (!lista) {
      return res.redirect('/dashboard?token=' + encodeURIComponent(token));
    }

    await Tarjeta.create({
      titulo,
      descripcion: descripcion || '',
      prioridad: prioridad || 'Media',
      listaId: lista.id
    });

    return res.redirect('/dashboard?token=' + encodeURIComponent(token));
  } catch (error) {
    console.error('Error al crear tarjeta en dashboard:', error.message);
    return res.status(500).send('Error interno: no se pudo crear la tarjeta.');
  }
});

app.post('/dashboard/tarjetas/:id/editar', async (req, res) => {
  try {
    const { token, titulo, descripcion, prioridad, listaId } = req.body;
    const { id } = req.params;

    const usuario = getUsuarioDesdeToken(token);
    if (!usuario) {
      return res.redirect('/login');
    }

    const tarjeta = await Tarjeta.findOne({
      where: { id },
      include: [
        {
          model: Lista,
          as: 'lista',
          include: [
            {
              model: Tablero,
              as: 'tablero',
              where: { usuarioId: usuario.id }
            }
          ]
        }
      ]
    });

    if (!tarjeta) {
      return res.redirect('/dashboard?token=' + encodeURIComponent(token));
    }

    if (titulo !== undefined) tarjeta.titulo = titulo;
    if (descripcion !== undefined) tarjeta.descripcion = descripcion;
    if (prioridad !== undefined) tarjeta.prioridad = prioridad;
    if (listaId !== undefined && listaId !== '') {
      const listaDestino = await Lista.findOne({
        where: { id: listaId },
        include: [{ model: Tablero, as: 'tablero', where: { usuarioId: usuario.id } }]
      });
      if (listaDestino) tarjeta.listaId = listaId;
    }

    await tarjeta.save();

    return res.redirect('/dashboard?token=' + encodeURIComponent(token));
  } catch (error) {
    console.error('Error al editar tarjeta:', error.message);
    return res.status(500).send('Error interno: no se pudo editar la tarjeta.');
  }
});

app.post('/dashboard/tarjetas/:id/eliminar', async (req, res) => {
  try {
    const { token } = req.body;
    const { id } = req.params;

    const usuario = getUsuarioDesdeToken(token);
    if (!usuario) {
      return res.redirect('/login');
    }

    const tarjeta = await Tarjeta.findOne({
      where: { id },
      include: [
        {
          model: Lista,
          as: 'lista',
          include: [
            {
              model: Tablero,
              as: 'tablero',
              where: { usuarioId: usuario.id }
            }
          ]
        }
      ]
    });

    if (tarjeta) {
      await tarjeta.destroy();
    }

    return res.redirect('/dashboard?token=' + encodeURIComponent(token));
  } catch (error) {
    console.error('Error al eliminar tarjeta:', error.message);
    return res.status(500).send('Error interno: no se pudo eliminar la tarjeta.');
  }
});

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log('KanbanPro corriendo en puerto ' + PORT);
    });
  } catch (error) {
    console.error('No se pudo iniciar la aplicacion:', error.message);
    process.exit(1);
  }
}

iniciarServidor();
