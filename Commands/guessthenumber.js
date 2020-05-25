const UserManager = require('../utils/UserManager');
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

    const rangeStart = ArrayManager.randomIntFromInterval(1, 95);
    const correctNumber = ArrayManager.randomIntFromInterval(rangeStart, rangeStart + 5);
    const winValue = (ArrayManager.randomIntFromInterval(3, 6) * bet);

    message.reply(`guess a number between **${rangeStart}** and **${rangeStart + 5}** inclusive. (betting ${bet} credits)`)
        .then(questionMessage => {
            const filter = m => !isNaN(m.content) && m.channel.id == questionMessage.channel.id && m.author.id == message.author.id;
            const collector = message.channel.createMessageCollector(filter, { time: 6300 });

            collector.on('collect', m => {
                collector.stop("Collected the number from the executor.");
                const guess = parseFloat(m);
                if(guess != correctNumber) {
                    UserManager.subtractBalance(message.author.id, message.guild.id, bet);
                    return message.reply(`unlucky! The number was **${correctNumber}**.\n${EmojisManager.blobSad}Lost **${bet}** credits.`)
                } else {
                    UserManager.addBalance(message.author.id, message.guild.id, winValue);
                    return message.reply(`correct! The number was **${correctNumber}**.\n${EmojisManager.arcadeCoin}Won **${winValue}** credits.`);
                }
            });

            collector.on('end', collected => {
                if(!collected.size) {
                    return message.reply("timeout, you need to be quicker with the response.");
                }
            });
        })
        .catch(err => {
            message.channel.send("An error occurred, sorry for the inconvenience.");
            console.log(err);
        });
};

module.exports = {
    name: 'guessthenumber',
    aliases: ['guess', 'gtn'],
    cooldown: 4,
    description: 'Guess a number between a range of 5 and win some credits.',
    execute
};