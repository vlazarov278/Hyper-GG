const Discord = require("discord.js");
const ConstantsManager = require("../utils/ConstantsManager");

/**
 * @param {Discord.Message} message
 * @param {Array} args
 */
const execute = async (message, args) => {

    var description = `__**Send the number that answers the question**__\n\nWould you like to sell roles in the server?
This means that (later in this setup) you can select multiple roles for members to obtain through spending credits.
Yes**(1)** or no**(2)**?`;

    const embed = new Discord.MessageEmbed()
        .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
        .setTitle("Marketplace setup")
        .setColor(ConstantsManager.default_colour)
        .setDescription(description)
        .setFooter(`Requested by ${message.author.tag}`);

    message.channel.send(embed);
};

module.exports = {
    name: 'market-setup',
    aliases: ['setup-market'],
    cooldown: 3,
    description: 'Configure the marketplace in the server',
    execute
};