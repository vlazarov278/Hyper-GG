module.exports = {
    name: 'ping',
    aliases: ['p'],
    description: 'Use this to get information on the connectivity of the bot.',
    execute: async (message) => {
        const msg = await message.channel.send("Measuring...");
        msg.edit(`Measured: \`${Math.abs(msg.createdTimestamp - message.createdTimestamp)}ms\``);
    }
};