const UserManager = require('../utils/UserManager');

const execute = (message) => {
    UserManager.closeAccount(message.author.id, message.guild.id)
        .then(() => message.reply("account is closed."))
        .catch(err => {
            console.log(err);
            return message.reply("an error occurred, sorry for the inconvenience.");
        });
};

module.exports = {
    name: 'close',
    description: 'Closes your in-server account for minigames.',
    aliases: ['close-account'],
    cooldown: 15,
    execute
};