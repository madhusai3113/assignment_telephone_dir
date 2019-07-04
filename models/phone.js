'use strict';
module.exports = (sequelize, DataTypes) => {
  const phone = sequelize.define('phone', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.UUID,
    },
    phoneNum: {
      type: DataTypes.STRING,
      unique:true
    },
    address: {
      type: DataTypes.STRING
    },
    aadhar: {
      type: DataTypes.STRING,
      unique:true
    }

  },
    {
      freezeTableName: true,
      timestamps: false
    });
  phone.associate = function (models) {
    // associations can be defined here
  };
  return phone;
};