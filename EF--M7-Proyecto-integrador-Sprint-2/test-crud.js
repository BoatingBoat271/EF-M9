const { sequelize, Tablero, Lista, Tarjeta } = require('./models');

async function testCrud() {
  try {
    await sequelize.authenticate();
    console.log('Conexion a PostgreSQL exitosa.');

    // Crear: nueva tarjeta asociada a una lista existente.
    const listaExistente = await Lista.findOne({ where: { nombre: 'Pendiente' } });

    if (!listaExistente) {
      throw new Error('No se encontro una lista llamada "Pendiente". Ejecuta primero: node seed.js');
    }

    const nuevaTarjeta = await Tarjeta.create({
      titulo: 'Validar flujo CRUD',
      descripcion: 'Tarjeta creada desde test-crud.js',
      prioridad: 'Media',
      listaId: listaExistente.id
    });
    console.log('Crear OK -> Tarjeta ID:', nuevaTarjeta.id);

    // Leer: un tablero con sus listas y tarjetas.
    const tableroConRelaciones = await Tablero.findOne({
      include: [
        {
          model: Lista,
          as: 'listas',
          include: [{ model: Tarjeta, as: 'tarjetas' }]
        }
      ]
    });

    if (!tableroConRelaciones) {
      throw new Error('No hay tableros para lectura. Ejecuta primero: node seed.js');
    }

    console.log('Leer OK -> Tablero:', tableroConRelaciones.nombre);
    console.log('Cantidad de listas:', tableroConRelaciones.listas.length);

    // Actualizar: modificar el titulo de la tarjeta creada.
    nuevaTarjeta.titulo = 'Validar flujo CRUD actualizado';
    await nuevaTarjeta.save();
    console.log('Actualizar OK -> Nuevo titulo:', nuevaTarjeta.titulo);

    // Borrar: eliminar la tarjeta creada.
    await Tarjeta.destroy({ where: { id: nuevaTarjeta.id } });
    console.log('Borrar OK -> Tarjeta eliminada ID:', nuevaTarjeta.id);
  } catch (error) {
    console.error('Error en test-crud:', error.message);
  } finally {
    await sequelize.close();
  }
}

testCrud();
