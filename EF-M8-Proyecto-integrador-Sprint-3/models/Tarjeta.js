module.exports = (sequelize, DataTypes) => {
  const Tarjeta = sequelize.define(
    'Tarjeta',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      prioridad: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Media',
        validate: {
          isIn: [['Baja', 'Media', 'Alta']]
        }
      }
    },
    {
      tableName: 'tarjetas',
      timestamps: true
    }
  );

  return Tarjeta;
};
