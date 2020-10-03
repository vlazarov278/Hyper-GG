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

    var willSellRoles = false;

    const embed = new Discord.MessageEmbed()
        .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
        .setTitle("Marketplace setup - Selling Roles")
        .setColor(ConstantsManager.default_colour)
        .setDescription(description)
        .setFooter(`Requested by ${message.author.tag}`);

    const filter = m => !isNaN(m.content) && m.channel.id == message.channel.id && m.author.id == message.author.id;
    var originalMessage = await message.channel.send(embed);

    try {
        var collected = await message.channel.awaitMessages(filter, { max: 1, time: 5000, errors: ['time'] });
        var m = collected.first();
        if (m.content.indexOf("1") != -1) {
            willSellRoles = true;
        }
        description = `__**Send the number that answers the question**__\n\nWould you like to sell away feature in the server?
This means that members can have the bot remember and announce for how long the user is going to be AFK or simply away.
Yes**(1)** or no**(2)**?`;
        m.delete();
        embed.setTitle("Market Setup - Away Command")
        embed.setDescription(description);
        originalMessage.edit({ embed });

        collected = await message.channel.awaitMessages(filter, { max: 1, time: 5000, errors: ['time'] });
        m = collected.first();
        message.reply(m.content);
    } catch (error) {
        return message.reply("timeout, you need to be quicker with the response.");
    }
};

module.exports = {
    name: 'market-setup',
    aliases: ['setup-market'],
    cooldown: 3,
    description: 'Configure the marketplace in the server',
    execute
};