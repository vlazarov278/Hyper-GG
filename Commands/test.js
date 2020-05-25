const UserManager = require('../utils/UserManager');
module.exports = {
    name: 'test',
    aliases: ['t'],
    description: 'Developer-only command for testing',
    execute: async (message, args) => {
        message.channel.send("Oh hi there");
    }
};