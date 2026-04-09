const express = require('express');
const { Usuario, Tablero, Lista, Tarjeta } = require('../models');

const router = express.Router();

router.get('/health', async (req, res) => {
  return res.json({ ok: true, message: 'API KanbanPro activa' });
});

router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Tablero, as: 'tableros' }],
      order: [['id', 'ASC']]
    });

    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

router.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        ok: false,
        message: 'nombre y email son obligatorios'
      });
    }

    const usuario = await Usuario.create({ nombre, email });

    return res.status(201).json({ ok: true, usuario });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
});

router.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    if (nombre !== undefined) usuario.nombre = nombre;
    if (email !== undefined) usuario.email = email;

    await usuario.save();

    return res.json({ ok: true, usuario });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
});

router.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    await usuario.destroy();

    return res.json({ ok: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
});

router.get('/tableros', async (req, res) => {
  try {
    const tableros = await Tablero.findAll({
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

    return res.json(tableros);
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
    const { nombre, descripcion, usuarioId } = req.body;

    if (!nombre || !usuarioId) {
      return res.status(400).json({
        ok: false,
        message: 'nombre y usuarioId son obligatorios'
      });
    }

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    const tablero = await Tablero.create({
      nombre,
      descripcion: descripcion || '',
      usuarioId
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

    const tablero = await Tablero.findByPk(id);
    if (!tablero) {
      return res.status(404).json({
        ok: false,
        message: 'Tablero no encontrado'
      });
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

    const tablero = await Tablero.findByPk(id);
    if (!tablero) {
      return res.status(404).json({
        ok: false,
        message: 'Tablero no encontrado'
      });
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

router.get('/listas', async (req, res) => {
  try {
    const listas = await Lista.findAll({
      include: [{ model: Tarjeta, as: 'tarjetas' }],
      order: [
        ['id', 'ASC'],
        [{ model: Tarjeta, as: 'tarjetas' }, 'id', 'ASC']
      ]
    });

    return res.json(listas);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener listas',
      error: error.message
    });
  }
});

router.post('/listas', async (req, res) => {
  try {
    const { nombre, orden, tableroId } = req.body;

    if (!nombre || !tableroId) {
      return res.status(400).json({
        ok: false,
        message: 'nombre y tableroId son obligatorios'
      });
    }

    const tablero = await Tablero.findByPk(tableroId);
    if (!tablero) {
      return res.status(404).json({
        ok: false,
        message: 'Tablero no encontrado'
      });
    }

    const lista = await Lista.create({
      nombre,
      orden: orden || 0,
      tableroId
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

router.put('/listas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, orden } = req.body;

    const lista = await Lista.findByPk(id);
    if (!lista) {
      return res.status(404).json({
        ok: false,
        message: 'Lista no encontrada'
      });
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

router.delete('/listas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const lista = await Lista.findByPk(id);
    if (!lista) {
      return res.status(404).json({
        ok: false,
        message: 'Lista no encontrada'
      });
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

router.post('/tarjetas', async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, listaId } = req.body;

    if (!titulo || !listaId) {
      return res.status(400).json({
        ok: false,
        message: 'titulo y listaId son obligatorios'
      });
    }

    const lista = await Lista.findByPk(listaId);
    if (!lista) {
      return res.status(404).json({
        ok: false,
        message: 'Lista no encontrada'
      });
    }

    const nuevaTarjeta = await Tarjeta.create({
      titulo,
      descripcion: descripcion || '',
      prioridad: prioridad || 'Media',
      listaId
    });

    return res.status(201).json({ ok: true, tarjeta: nuevaTarjeta });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear tarjeta',
      error: error.message
    });
  }
});

router.put('/tarjetas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, prioridad } = req.body;

    const tarjeta = await Tarjeta.findByPk(id);
    if (!tarjeta) {
      return res.status(404).json({
        ok: false,
        message: 'Tarjeta no encontrada'
      });
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

router.delete('/tarjetas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tarjeta = await Tarjeta.findByPk(id);
    if (!tarjeta) {
      return res.status(404).json({
        ok: false,
        message: 'Tarjeta no encontrada'
      });
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
