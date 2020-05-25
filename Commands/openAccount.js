const UserManager = require('../utils/UserManager');

const execute = (message) => {
    UserManager.openAccount(message.author.id, message.guild.id, message.author.tag, 100)
        .then(u => message.reply("account opened successfully."))
        .catch(err => {
            if (err.name === "AccountExistsException") {
                return message.channel.send("You already have an account in this server.");
            }
            console.error(err);
            return message.reply("an error occurred, sorry for the inconvenience.");
        });
};

module.exports = {
    name: 'open',
    description: 'Opens an in-server account for minigames.',
    aliases: ['open-account'],
    cooldown: 15,
    execute
};