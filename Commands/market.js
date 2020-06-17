const Discord = require("discord.js");

/**
 * @param {Discord.Message} message
 * @param {Array} args
 */
const execute = async (message, args) => {
    
};

module.exports = {
    name: 'market',
    aliases: ['shop', 'marketplace'],
    cooldown: 3,
    description: 'Gives you information on the marketplace in the server and benefits you can obtain',
    execute
};