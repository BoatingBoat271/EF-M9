module.exports = (sequelize, DataTypes) => {
  const Tablero = sequelize.define(
    'Tablero',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'tableros',
      timestamps: true
    }
  );

  return Tablero;
};
