const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = require('./Usuario')(sequelize, DataTypes);
const Tablero = require('./Tablero')(sequelize, DataTypes);
const Lista = require('./Lista')(sequelize, DataTypes);
const Tarjeta = require('./Tarjeta')(sequelize, DataTypes);

Usuario.hasMany(Tablero, {
  foreignKey: 'usuarioId',
  as: 'tableros',
  onDelete: 'CASCADE'
});
Tablero.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

Tablero.hasMany(Lista, {
  foreignKey: 'tableroId',
  as: 'listas',
  onDelete: 'CASCADE'
});
Lista.belongsTo(Tablero, {
  foreignKey: 'tableroId',
  as: 'tablero'
});

Lista.hasMany(Tarjeta, {
  foreignKey: 'listaId',
  as: 'tarjetas',
  onDelete: 'CASCADE'
});
Tarjeta.belongsTo(Lista, {
  foreignKey: 'listaId',
  as: 'lista'
});

module.exports = {
  sequelize,
  Usuario,
  Tablero,
  Lista,
  Tarjeta
};
