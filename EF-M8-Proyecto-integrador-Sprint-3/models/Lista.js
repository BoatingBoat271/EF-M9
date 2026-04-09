module.exports = (sequelize, DataTypes) => {
  const Lista = sequelize.define(
    'Lista',
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
      orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'listas',
      timestamps: true
    }
  );

  return Lista;
};
