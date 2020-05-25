const GuildManager = require('../utils/GuildManager');

module.exports = {
    name: 'setprefix',
    aliases: ['prefix'],
    description: 'Use this to set a prefix for the server',
    execute: async (message, args) => {
        if(!args[0]) return message.channel.send("You must include the prefix you would like to use.");

        var prefix = args[0];

        if(prefix.length > 5) return message.channel.send("Prefix must be less or equal to 5 characters");

        GuildManager.setPrefix(message.guild.id, prefix, message.guild.name).then(g => {
            return message.channel.send(`Prefix set to \`${prefix}\`.`)
        });
    }
};