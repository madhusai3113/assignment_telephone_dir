'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      autoIncrement: true,
    },
    name: {
      type : DataTypes.STRING
    }

  },
    {
      freezeTableName: true,
      timestamps: false
  
  });

  return user;
};