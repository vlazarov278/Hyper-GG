const Discord = require("discord.js");
const ArrayManager = require('../utils/ArrayManager');
const EmojisManager = require('../utils/EmojisManager');
const ConstantsManager = require('../utils/ConstantsManager');
const MentionManager = require('../utils/MentionManager');
/**
 * @param {Discord.Message} message
 * @param {Array} args
 */

const execute = async (message, args) => {

    MentionManager.extractChannelFromMessage(message, args)
        .then(async channel => {
            const seconds = 3;
            const milliseconds = seconds * 1000;
            const prize = ArrayManager.randomIntFromInterval(500, 1500);
            var description = `${EmojisManager.warning} **React to this embed in the next ${seconds} seconds for a prize of ${prize} credits**`;
            const embed = new Discord.MessageEmbed()
                .setColor(ConstantsManager.positive_yellow)
                .setTitle("CREDITS DROP")
                .setDescription(description)
                .setThumbnail("https://thumbs.gfycat.com/UniqueSizzlingFinwhale-small.gif")
                .setTimestamp();

            const msg = await channel.send({embed});

            msg.awaitReactions((() => true), {time: milliseconds})
                .then(collected => {
                    const users = new Set();
                    collected.forEach(messageReaction => {
                        const u = messageReaction.users.cache;
                        u.forEach(user => {
                            users.add(user);
                        });
                    });
                    const arrayUsers = Array.from(users);
                    description = `~~React to this embed in the next ${seconds} seconds for a prize of ${prize} credits~~\n${arrayUsers.length == 0 ? "**No one reacted fast enough.**" : `**Winners: ${arrayUsers.join(', ')}**`}`;
                    embed.setDescription(description);
                    embed.setTitle("CREDITS DROP - FINISHED")
                    if(arrayUsers.length == 0) embed.setThumbnail("https://www.techjunkie.com/wp-content/uploads/2018/03/Cute-Variants-of-Sad-Gif-3.gif");
                    else embed.setThumbnail("https://media2.giphy.com/media/ehz3LfVj7NvpY8jYUY/giphy.gif");
                    msg.edit({embed});
                })
                .catch(err => {
                    console.log(err);
                    message.reply("an error occurred. Sorry for the inconvenience.")
                })
        })
        .catch(err => {
            if (err.name = "NoMentionedChannelException") {
                return message.reply("you need to include a channel mention (#example) for this command.");
            }
            console.error(err);
            message.reply("an error occurred. Sorry for the inconvenience.");
        })
};

module.exports = {
    name: 'drop',
    aliases: ['drops'],
    //cooldown: 5,
    description: 'Force a drop of credits into a channel',
    execute
};