const Discord = require("discord.js");
const ConstantsManager = require('../utils/ConstantsManager');
module.exports = {
    name: 'test',
    aliases: ['t'],
    description: 'Developer-only command for testing',
    execute: async (message, args) => {

        if(message.author.id != ConstantsManager.owner_id) return;

        const embed = new Discord.MessageEmbed()
        .setFooter("ProTenurial#2045 (711280302135312474)")
        .setDescription("**ID: eQ6uzg24J** (Mute)\n**Moderator:** SpottedLights#0001\n**Reason:** speaking other language after warn - Mon, 25 May 2020 17:29:40 GMT")
        //.setThumbnail("https://cdn.discordapp.com/attachments/612990664728117308/714535203581984768/599d31d86f12b_thumb900-removebg-preview.png");

        message.channel.send({embed});
    }
};