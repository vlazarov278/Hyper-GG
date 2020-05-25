const Sequelize = require("sequelize");
const path = require("path");
const db = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/main.sqlite'
});

module.exports = db;