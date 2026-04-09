const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const { Usuario, Tablero, Lista, Tarjeta } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'kanbanpro_secret_sprint3';

const router = express.Router();

router.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'email y password son obligatorios'
      });
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({
        ok: false,
        message: 'El usuario ya existe'
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const nombre = email.split('@')[0];

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hash
    });

    const tableroInicial = await Tablero.create({
      nombre: 'Mi primer tablero',
      descripcion: 'Tablero inicial creado automaticamente',
      usuarioId: usuario.id
    });

    await Lista.bulkCreate([
      { nombre: 'Pendiente', orden: 1, tableroId: tableroInicial.id },
      { nombre: 'En progreso', orden: 2, tableroId: tableroInicial.id },
      { nombre: 'Completado', orden: 3, tableroId: tableroInicial.id }
    ]);

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'email y password son obligatorios'
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !usuario.password) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales invalidas'
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales invalidas'
      });
    }

    const cantidadTableros = await Tablero.count({ where: { usuarioId: usuario.id } });
    if (cantidadTableros === 0) {
      const tableroInicial = await Tablero.create({
        nombre: 'Mi primer tablero',
        descripcion: 'Tablero inicial creado automaticamente',
        usuarioId: usuario.id
      });

      await Lista.bulkCreate([
        { nombre: 'Pendiente', orden: 1, tableroId: tableroInicial.id },
        { nombre: 'En progreso', orden: 2, tableroId: tableroInicial.id },
        { nombre: 'Completado', orden: 3, tableroId: tableroInicial.id }
      ]);
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    return res.json({ ok: true, token });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al iniciar sesion',
      error: error.message
    });
  }
});

router.use(authMiddleware);

router.get('/tableros', async (req, res) => {
  try {
    const tableros = await Tablero.findAll({
      where: { usuarioId: req.usuario.id },
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

    return res.json({ ok: true, tableros });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener tableros',
      error: error.message
    });
  }
});

router.post('/tableros', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ ok: false, message: 'nombre es obligatorio' });
    }

    const tablero = await Tablero.create({
      nombre,
      descripcion: descripcion || '',
      usuarioId: req.usuario.id
    });

    return res.status(201).json({ ok: true, tablero });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear tablero',
      error: error.message
    });
  }
});

router.put('/tableros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const tablero = await Tablero.findOne({
      where: { id, usuarioId: req.usuario.id }
    });

    if (!tablero) {
      return res.status(404).json({ ok: false, message: 'Tablero no encontrado' });
    }

    if (nombre !== undefined) tablero.nombre = nombre;
    if (descripcion !== undefined) tablero.descripcion = descripcion;

    await tablero.save();

    return res.json({ ok: true, tablero });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar tablero',
      error: error.message
    });
  }
});

router.delete('/tableros/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tablero = await Tablero.findOne({
      where: { id, usuarioId: req.usuario.id }
    });

    if (!tablero) {
      return res.status(404).json({ ok: false, message: 'Tablero no encontrado' });
    }

    await tablero.destroy();

    return res.json({ ok: true, message: 'Tablero eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar tablero',
      error: error.message
    });
  }
});

router.post('/tableros/:tableroId/listas', async (req, res) => {
  try {
    const { tableroId } = req.params;
    const { nombre, orden } = req.body;

    if (!nombre) {
      return res.status(400).json({ ok: false, message: 'nombre es obligatorio' });
    }

    const tablero = await Tablero.findOne({
      where: { id: tableroId, usuarioId: req.usuario.id }
    });

    if (!tablero) {
      return res.status(404).json({ ok: false, message: 'Tablero no encontrado' });
    }

    const lista = await Lista.create({
      nombre,
      orden: orden || 0,
      tableroId: tablero.id
    });

    return res.status(201).json({ ok: true, lista });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear lista',
      error: error.message
    });
  }
});

router.put('/tableros/:tableroId/listas/:id', async (req, res) => {
  try {
    const { tableroId, id } = req.params;
    const { nombre, orden } = req.body;

    const lista = await Lista.findOne({
      where: { id, tableroId },
      include: [
        {
          model: Tablero,
          as: 'tablero',
          where: { usuarioId: req.usuario.id }
        }
      ]
    });

    if (!lista) {
      return res.status(404).json({ ok: false, message: 'Lista no encontrada' });
    }

    if (nombre !== undefined) lista.nombre = nombre;
    if (orden !== undefined) lista.orden = orden;

    await lista.save();

    return res.json({ ok: true, lista });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar lista',
      error: error.message
    });
  }
});

router.delete('/tableros/:tableroId/listas/:id', async (req, res) => {
  try {
    const { tableroId, id } = req.params;

    const lista = await Lista.findOne({
      where: { id, tableroId },
      include: [
        {
          model: Tablero,
          as: 'tablero',
          where: { usuarioId: req.usuario.id }
        }
      ]
    });

    if (!lista) {
      return res.status(404).json({ ok: false, message: 'Lista no encontrada' });
    }

    await lista.destroy();

    return res.json({ ok: true, message: 'Lista eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar lista',
      error: error.message
    });
  }
});

router.post('/listas/:listaId/tarjetas', async (req, res) => {
  try {
    const { listaId } = req.params;
    const { titulo, descripcion, prioridad } = req.body;

    if (!titulo) {
      return res.status(400).json({ ok: false, message: 'titulo es obligatorio' });
    }

    const lista = await Lista.findOne({
      where: { id: listaId },
      include: [
        {
          model: Tablero,
          as: 'tablero',
          where: { usuarioId: req.usuario.id }
        }
      ]
    });

    if (!lista) {
      return res.status(404).json({ ok: false, message: 'Lista no encontrada' });
    }

    const tarjeta = await Tarjeta.create({
      titulo,
      descripcion: descripcion || '',
      prioridad: prioridad || 'Media',
      listaId: lista.id
    });

    return res.status(201).json({ ok: true, tarjeta });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear tarjeta',
      error: error.message
    });
  }
});

router.put('/listas/:listaId/tarjetas/:id', async (req, res) => {
  try {
    const { listaId, id } = req.params;
    const { titulo, descripcion, prioridad } = req.body;

    const tarjeta = await Tarjeta.findOne({
      where: { id, listaId },
      include: [
        {
          model: Lista,
          as: 'lista',
          include: [
            {
              model: Tablero,
              as: 'tablero',
              where: { usuarioId: req.usuario.id }
            }
          ]
        }
      ]
    });

    if (!tarjeta) {
      return res.status(404).json({ ok: false, message: 'Tarjeta no encontrada' });
    }

    if (titulo !== undefined) tarjeta.titulo = titulo;
    if (descripcion !== undefined) tarjeta.descripcion = descripcion;
    if (prioridad !== undefined) tarjeta.prioridad = prioridad;

    await tarjeta.save();

    return res.json({ ok: true, tarjeta });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar tarjeta',
      error: error.message
    });
  }
});

router.delete('/listas/:listaId/tarjetas/:id', async (req, res) => {
  try {
    const { listaId, id } = req.params;

    const tarjeta = await Tarjeta.findOne({
      where: { id, listaId },
      include: [
        {
          model: Lista,
          as: 'lista',
          include: [
            {
              model: Tablero,
              as: 'tablero',
              where: { usuarioId: req.usuario.id }
            }
          ]
        }
      ]
    });

    if (!tarjeta) {
      return res.status(404).json({ ok: false, message: 'Tarjeta no encontrada' });
    }

    await tarjeta.destroy();

    return res.json({ ok: true, message: 'Tarjeta eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar tarjeta',
      error: error.message
    });
  }
});

module.exports = router;
