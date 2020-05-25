const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  // Model attributes are defined here
  user_id: {
      type: DataTypes.STRING,
      allowNull: false
  },
  tag: {
      type: DataTypes.STRING
  },
  guild_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
      type: DataTypes.DOUBLE,
      allowNull: false
  },
  bonus_timestamp: {
      type: DataTypes.DATE,
      allowNull: true
  }
}, {
  // Other model options go here
});

User.sync();

module.exports = User;