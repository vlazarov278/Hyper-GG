const Discord = require("discord.js");
const ArrayManager = require('../utils/ArrayManager');
const UserManager = require('../utils/UserManager');
const GambleManager = require('../utils/GambleManager');
const EmojisManager = require('../utils/EmojisManager');
/**
 * @param {Discord.Message} message
 */
const execute = async (message, args) => {

    try {
        var bet = await GambleManager.backgroundCheck(message, args);
    } catch (error) {
        return message.channel.send(error.message);
    }

    const winValue = (ArrayManager.randomIntFromInterval(3, 6) * bet);

    var slotsMessage;
    var messageSent;
    for (var index = 0; index < 3; index++) {
        // Here will be generated 6 emojis, 3 for the line #1 and 3 for line #3
        const generatedEmojis = [];
        const emojis = EmojisManager.getSlotsEmotes();
        for (let i = 0; i < 6; i++) {
            generatedEmojis.push(ArrayManager.getRandomElement(emojis));
        }
        var isWin = false;
        if (index == 2) isWin = Math.random() >= 0.6;
        const middleLineEmojis = [];
        if (isWin) {
            const winEmoji = ArrayManager.getRandomElement(emojis);
            for (let i = 0; i < 3; i++) {
                middleLineEmojis.push(winEmoji);
            }
        } else {
            const firstEmoji = ArrayManager.getRandomElement(emojis);
            var secondEmoji;
            do {
                // Second Emoji will always be different than the first one so the loss doesn't accidentally show as a win
                secondEmoji = ArrayManager.getRandomElement(emojis);
            } while (firstEmoji == secondEmoji);
            const thirdEmoji = ArrayManager.getRandomElement(emojis);
            middleLineEmojis.push(firstEmoji);
            middleLineEmojis.push(secondEmoji);
            middleLineEmojis.push(thirdEmoji);
        }
        slotsMessage = `
**| ${message.author} (using ${bet} credits)
-------------------
|>>>   ${EmojisManager.slots}   <<<|
-------------------
| ${generatedEmojis[0]} : ${generatedEmojis[1]} : ${generatedEmojis[2]} |
  
| ${middleLineEmojis[0]} : ${middleLineEmojis[1]} : ${middleLineEmojis[2]} |  ${EmojisManager.arrowLeft} ${EmojisManager.arrowLeft}
   
| ${generatedEmojis[3]} : ${generatedEmojis[4]} : ${generatedEmojis[5]} |
-------------------
|>>>   ${EmojisManager.slots}   <<<|
-------------------**\n`;

        if (index == 2) {
            slotsMessage += `${isWin ? `**${EmojisManager.arcadeCoin} WINNER (+${winValue})**` : `**${EmojisManager.blobSad} LOOSER (-${bet})**`}`
            if (isWin) {
                await UserManager.addBalance(message.author.id, message.guild.id, winValue);
            } else {
                await UserManager.subtractBalance(message.author.id, message.guild.id, bet);
            }
        }

        if (index == 0) {
            messageSent = await message.channel.send(slotsMessage);
            await new Promise((resolve) => setTimeout(() => { resolve() }, 1000));
        } else {
            await messageSent.edit(slotsMessage);
            await new Promise((resolve) => setTimeout(() => { resolve() }, 1000));
        }
    }
};

module.exports = {
    name: 'slots',
    cooldown: 5,
    description: 'Play against the odds a game of virtual slots to win credits',
    execute
};