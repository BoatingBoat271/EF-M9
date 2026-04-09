const express = require('express');
const hbs     = require('hbs');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = 3000;
const apiRoutes = require('./routes/api');

// Ruta constante al archivo de datos
const rutaData = path.join(__dirname, 'data', 'data.json');

// Motor de vistas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Registro de parciales
const partialsDir = path.join(__dirname, 'views', 'partials');
fs.readdirSync(partialsDir).forEach(function (filename) {
  const match = /^([^.]+)\.hbs$/.exec(filename);
  if (!match) return;
  const name     = match[1];
  const template = fs.readFileSync(path.join(partialsDir, filename), 'utf-8');
  hbs.registerPartial(name, template);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

// Rutas GET

// Inicio
app.get('/', (req, res) => {
  res.render('home');
});

// Registro (visual, sin backend de autenticación)
app.get('/register', (req, res) => {
  res.render('register');
});

// Login (visual, sin sesiones)
app.get('/login', (req, res) => {
  res.render('login');
});

// Dashboard: lee data.json y pasa los tableros a la vista
app.get('/dashboard', (req, res) => {
  try {
    const contenido = fs.readFileSync(rutaData, 'utf-8');
    const datos     = JSON.parse(contenido);
    res.render('dashboard', { tableros: datos.tableros });
  } catch (error) {
    console.error('Error al leer data.json:', error.message);
    res.status(500).send('Error interno: no se pudo cargar el tablero.');
  }
});

// Ruta POST - nueva tarjeta
app.post('/nueva-tarjeta', (req, res) => {
  try {
    const { titulo, descripcion, prioridad, tag, autor, responsable, lista } = req.body;

    const contenido = fs.readFileSync(rutaData, 'utf-8');
    const datos     = JSON.parse(contenido);

    const nuevaTarjeta = {
      id:             Date.now(),
      titulo:         titulo        || 'Sin título',
      descripcion:    descripcion   || '',
      prioridad:      prioridad     || 'Media',
      tag:            tag           || '',
      estado:         lista,
      fecha_creacion: new Date().toISOString().split('T')[0],
      fecha_inicio:   '',
      fecha_fin:      '',
      autor:          autor         || '',
      responsable:    responsable   || ''
    };

    const tableroDestino = datos.tableros.find(t => t.nombre === lista);
    if (tableroDestino) {
      tableroDestino.tarjetas.push(nuevaTarjeta);
    } else {
      datos.tableros[0].tarjetas.push(nuevaTarjeta);
    }

    fs.writeFileSync(rutaData, JSON.stringify(datos, null, 2), 'utf-8');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error al guardar la tarjeta:', error.message);
    res.status(500).send('Error interno: no se pudo guardar la tarjeta.');
  }
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`KanbanPro corriendo en http://localhost:${PORT}`);
});
