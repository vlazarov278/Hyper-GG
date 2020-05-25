const UserManager = require('../utils/UserManager');
const GuildManager = require('../utils/GuildManager');
const ArrayManager = require('../utils/ArrayManager');
const GambleManager = require('../utils/GambleManager');
const EmojisManager = require('../utils/EmojisManager');
const Discord = require("discord.js");

/**
 * @param {Discord.Message} message
 * @param {Array} args
 */

const execute = async (message, args) => {
    try {
        var bet = await GambleManager.backgroundCheck(message, args);
    } catch (error) {
        return message.channel.send(error.message);
    }

    const isWin = Math.random() >= 0.5;
    const winValue = (ArrayManager.randomIntFromInterval(2, 4) * bet);
    const streets = await GuildManager.getStreetNames(message.guild.id);
    const street = ArrayManager.getRandomElement(streets);

    message.channel.send(`Robbing the bank on **${street}** street with equipment worth **${bet}** credits...`)
        .then(msg => {
            setTimeout(() => {
                if(isWin) {
                    UserManager.addBalance(message.author.id, message.guild.id, winValue);
                    msg.edit(`${EmojisManager.arcadeCoin}It was a successful one. You stole **${winValue}** from the bank. (With an investment of **${bet}** credits)`)
                } else {
                    UserManager.subtractBalance(message.author.id, message.guild.id, bet);
                    msg.edit(`${EmojisManager.blobSad}No luck. At least you are not in prison. Lost your investment of **${bet}** credits.`);
                }
            }, 1750);
        })
        .catch(err => console.error(err));
};

module.exports = {
    name: 'heist',
    aliases: ['robbery', 'rob'],
    cooldown: 3,
    description: ' You can try your odds and see if you can get away with a heist',
    execute
};