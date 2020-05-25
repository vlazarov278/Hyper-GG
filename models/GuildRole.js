const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GuildRole = sequelize.define('GuildRole', {
  // Model attributes are defined here
  guild_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  allowed_array_json: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

GuildRole.sync();

module.exports = GuildRole;