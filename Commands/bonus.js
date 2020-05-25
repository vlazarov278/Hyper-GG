const UserManager = require('../utils/UserManager');
const EmojiManager = require('../utils/EmojisManager');
const Discord = require("discord.js");
const ConstantsManager = require('../utils/ConstantsManager');
const ms = require("ms");
/**
 * @param {Discord.Message} message
 */
const execute = async (message) => {
    const bonus = 100;
    const interval = 21600000;
    UserManager.bonusBoost(message.author.id, message.guild.id, bonus, interval)
        .then(user => {
            const embed = new Discord.MessageEmbed()
            .setColor(ConstantsManager.positive_yellow)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`${EmojiManager.arcadeCoin} **${bonus}** credits are now added to your balance. Enjoy!`)
            .setFooter(`Current balance: ${user.balance}`, message.client.user.displayAvatarURL())
            .setTimestamp();

            message.channel.send({embed});
        })
        .catch(err => {
            if(err.name === "NoAccountException") {
                return message.reply("you have no account in this server.")
            } else if(err.name === "PrematureBonusException") {
                var timeLeft = parseInt(err.message) + interval - Date.now();
                return message.reply(`you still must wait **${ms(timeLeft, {long: true})}** before you can get a new bonus.`);
            }
        });
};

module.exports = {
    name: 'bonus',
    aliases: ['pay', 'payday'],
    description: 'Use this to get a boost of credits in your account balance',
    execute
};