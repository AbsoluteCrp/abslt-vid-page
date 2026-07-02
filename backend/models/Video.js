const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Video', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false, // The path/name of the saved file
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  });
};
