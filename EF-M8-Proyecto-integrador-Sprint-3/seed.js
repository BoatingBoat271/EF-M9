const { sequelize, Usuario, Tablero, Lista, Tarjeta } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Conexion a PostgreSQL exitosa.');

    await sequelize.sync({ force: true });
    console.log('Tablas creadas correctamente.');

    const passwordHash = await bcrypt.hash('12345678', 10);

    const usuarios = await Usuario.bulkCreate([
      { nombre: 'Pablo', email: 'pablo@kanbanpro.com', password: passwordHash },
      { nombre: 'Marelly', email: 'marelly@kanbanpro.com', password: passwordHash }
    ]);

    const tableros = await Tablero.bulkCreate([
      {
        nombre: 'Sprint 2 - Desarrollo',
        descripcion: 'Tablero principal de desarrollo',
        usuarioId: usuarios[0].id
      },
      {
        nombre: 'Marketing Q2',
        descripcion: 'Tablero de tareas de marketing',
        usuarioId: usuarios[1].id
      },
      {
        nombre: 'Backlog Tecnico',
        descripcion: 'Mejoras internas y deuda tecnica',
        usuarioId: usuarios[0].id
      }
    ]);

    const listas = await Lista.bulkCreate([
      { nombre: 'Pendiente', orden: 1, tableroId: tableros[0].id },
      { nombre: 'En progreso', orden: 2, tableroId: tableros[0].id },
      { nombre: 'Completado', orden: 3, tableroId: tableros[0].id },
      { nombre: 'Ideas', orden: 1, tableroId: tableros[1].id },
      { nombre: 'Ejecucion', orden: 2, tableroId: tableros[1].id },
      { nombre: 'Priorizado', orden: 1, tableroId: tableros[2].id }
    ]);

    await Tarjeta.bulkCreate([
      {
        titulo: 'Configurar Sequelize',
        descripcion: 'Instalar y configurar el ORM para PostgreSQL',
        prioridad: 'Alta',
        listaId: listas[0].id
      },
      {
        titulo: 'Crear modelos y relaciones',
        descripcion: 'Definir Usuario, Tablero, Lista y Tarjeta',
        prioridad: 'Alta',
        listaId: listas[1].id
      },
      {
        titulo: 'Preparar demo de sprint',
        descripcion: 'Checklist para presentacion del avance',
        prioridad: 'Media',
        listaId: listas[2].id
      },
      {
        titulo: 'Brainstorm campana abril',
        descripcion: 'Definir ideas iniciales de contenido',
        prioridad: 'Baja',
        listaId: listas[3].id
      }
    ]);

    console.log('Datos de prueba insertados correctamente.');
    console.log(`Usuarios: ${await Usuario.count()}`);
    console.log(`Tableros: ${await Tablero.count()}`);
    console.log(`Listas: ${await Lista.count()}`);
    console.log(`Tarjetas: ${await Tarjeta.count()}`);
  } catch (error) {
    console.error('Error en seed:', error.message);
  } finally {
    await sequelize.close();
  }
}

seed();
