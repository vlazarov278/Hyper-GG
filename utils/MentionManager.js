const Discord = require("discord.js");

const extractChannelFromMessage = async (message, args) => {
    return new Promise((resolve, reject) => {
        if(!message.mentions.channels) {
            var noMentionedChannelException = new Error("No channels were mentioned in the message.");
            noMentionedChannelException.name = "NoMentionedChannelException";
            return reject(noMentionedChannelException);
        }
        const channel = message.mentions.channels.first();
        if(channel.guild.id != message.guild.id) {
            var outsideGuildChannel = new Error("Channel is not in this guild");
            outsideGuildChannel.name = "OutsideGuildChannel";
            return reject(outsideGuildChannel);
        }
        return resolve(channel);
    });
};

/**
 * 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */
const extractUserFromMessage = async (message, args) => {
    return new Promise(async (resolve, reject) => {
        try {
            var targetUser = message.author;
            var isAuthor = true;
            // Check if there is a mentioned member
            if (message.mentions.users.size) {
                targetUser = message.mentions.users.first();
                isAuthor = false;
            };

            // Check if a user ID or username is passed as arguments
            if (args[0]) {
                if (!isNaN(args[0])) {
                    // Most likely an ID because it's a number
                    let fetched = await message.guild.members.fetch(args[0]);
                    if (fetched) {
                        targetUser = fetched.user;
                        isAuthor = false;
                    }
                } else {
                    // Do a query on the name and attempt to find somebody
                    let fetchedCollection = await message.guild.members.fetch({ query: args.join(' '), limit: 1 });
                    if (fetchedCollection.size) {
                        targetUser = fetchedCollection.first().user;
                        isAuthor = false;
                    }
                }
            }
            resolve({
                targetUser,
                isAuthor
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    extractUserFromMessage,
    extractChannelFromMessage
}