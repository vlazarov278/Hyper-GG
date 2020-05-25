const UserManager = require('../utils/UserManager');
const MentionManager = require('../utils/MentionManager');
const EmojiManager = require('../utils/EmojisManager');
const ConstantsManager = require('../utils/ConstantsManager');
const Discord = require("discord.js");

/**
 * @param {Discord.Message} message
 * @param {Array} args
 */

const execute = async (message, args) => {
    const { targetUser, isAuthor } = await MentionManager.extractUserFromMessage(message, args);

    UserManager.getBalance(targetUser.id, message.guild.id)
        .then(balance => {
            const embed = new Discord.MessageEmbed()
                .setAuthor(targetUser.tag, targetUser.displayAvatarURL({ dynamic: true }))
                .setDescription(`${EmojiManager.arcadeCoin} **Balance:** ${balance}`)
                .setColor(ConstantsManager.positive_yellow)
                .setFooter(`Requested by ${message.author.tag}`);

            message.channel.send({ embed });
        })
        .catch(err => {
            if (err.name === "NoAccountException") {
                return message.reply(`**${isAuthor ? "You** have" : targetUser.tag + "** has"} no account in this server.`);
            }
            console.error(err);
            message.reply("an error occurred, sorry for the inconvenience.");
        });
};

module.exports = {
    name: 'balance',
    aliases: ['bal', 'b'],
    description: 'Use this to get information on your balance in the server.',
    execute
};