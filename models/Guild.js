const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guild = sequelize.define('Guild', {
  // Model attributes are defined here
  guild_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  prefix: {
    type: DataTypes.STRING,
    allowNull: true
  },
  streets_array_json: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  // Other model options go here
});

Guild.sync();

module.exports = Guild;