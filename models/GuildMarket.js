const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GuildMarket = sequelize.define('GuildMarket', {
  // Model attributes are defined here
  guild_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_selling_roles: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
  },
  is_selling_away: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
  },
  is_selling_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
  },
  roles_array_json: {
      type: DataTypes.STRING,
      allowNull: true
  }
}, {
  // Other model options go here
});

GuildMarket.sync();

module.exports = GuildMarket;