const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Drops = sequelize.define('Drops', {
    // Model attributes are defined here
    guild_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    executor_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    drop_timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    collectors_array_json: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
});

Drops.sync();

module.exports = Drops;