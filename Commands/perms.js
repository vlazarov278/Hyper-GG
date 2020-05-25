const GuildRoleManager = require('../utils/GuildRoleManager');
const ConstantsManager = require('../utils/ConstantsManager');
const Discord = require("discord.js");

/**
 * @param {Discord.Message} message
 */
const execute = async (message) => {
    if (message.client.perms_setup[message.guild.id]) return message.reply(`there is an ongoing setup already initiated by ${message.client.perms_setup[message.guild.id].tag}`);
    message.client.perms_setup[message.guild.id] = {
        tag: message.author.tag
    };
    var description = "Send the number that answers the question\n\nSelect the role that you want to set up or edit it's permissions:\n";
    var index = 1;
    var indexedRoles = {};
    message.guild.roles.cache.forEach(role => {
        description += `${index != 1 ? '\n' : ''}${role}**(${index})**`;
        indexedRoles[index] = role;
        index++;
    });

    const embed = new Discord.MessageEmbed()
        .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
        .setColor(ConstantsManager.default_colour)
        .setDescription(description)
        .setFooter(`Requested by ${message.author.tag}`);

    message.channel.send({ embed }).then(msg => {
        const filter = m => m.channel.id == msg.channel.id && m.author.id == message.author.id;
        const collector = message.channel.createMessageCollector(filter, { idle: 11000 });
        var position = 0;
        var role;
        var isRemoving = false;
        const cmdNames = [];

        collector.on('collect', async m => {
            if (m.content.toLowerCase() == "cancel") return collector.stop("cancel");
            if (isNaN(m.content) && position != 2) return;
            collector.resetTimer({ idle: 10000 });
            m.delete();
            const answer = parseInt(m);
            if (position == 0) {
                // They answered the role they wanted to edit
                if (indexedRoles[answer] == null) {
                    return message.reply("Please select a valid role");
                }
                role = indexedRoles[answer];
                description = `Send the number that answers the question\n\n${role}\nDo you want to list**(1)**, give**(2)** or deny**(3)** permissions?`
                embed.setDescription(description);
                await msg.edit({ embed })
                position++;
            } else if (position == 1) {
                // They answered whether they were adding or removing permissions
                if (answer == 1) {
                    return collector.stop("request_list");
                }
                if (answer == 3) isRemoving = true;
                const currentlyAllowed = await GuildRoleManager.getAllowedCommands(message.guild.id, role.id);
                description = `Send in separate messages the names of the commands that you want to ${isRemoving ? 'deny' : 'permit'}. Send \`end\` to finish.\n${currentlyAllowed.length == 0 ? '' : `Currently Permitted: ${currentlyAllowed.join(', ')}\n`}`;
                embed.setDescription(description);
                await msg.edit({ embed });
                position++;
            } else if (position == 2) {
                if (m.content.toLowerCase() == "end") {
                    collector.stop("request_end");
                    return;
                }
                cmdNames.push(m.content);
                var addDescription = `Accepted so far:  ${cmdNames.join(', ')}`;
                embed.setDescription(description + addDescription);
                await msg.edit({ embed });
            }
        });

        collector.on('end', async (collected, reason) => {
            delete message.client.perms_setup[message.guild.id];
            if (reason == "request_end") {
                if (isRemoving) {
                    await GuildRoleManager.removeAllowedCommands(message.guild.id, role.id, cmdNames);
                } else {
                    await GuildRoleManager.addAllowedCommands(message.guild.id, role.id, cmdNames);
                }
                const currentlyAllowed = await GuildRoleManager.getAllowedCommands(message.guild.id, role.id);
                description = `${role} ${currentlyAllowed.length == 0 ? 'has no permissions currently.' : `has these permissions: **${currentlyAllowed.join(', ')}**`}`;
                embed.setDescription(description);
                msg.edit({ embed });
            } else if (reason == "cancel") {
                embed.setDescription("Command is canceled. No changes made.");
                return msg.edit({ embed });
            } else if (reason == "request_list") {
                const currentlyAllowed = await GuildRoleManager.getAllowedCommands(message.guild.id, role.id);
                description = `${role} ${currentlyAllowed.length == 0 ? 'has no permissions currently.' : `has these permissions: **${currentlyAllowed.join(', ')}**`}`;
                embed.setDescription(description);
                return msg.edit(embed);
            } else {
                msg.delete({ timeout: 5000 });
                if (!collected.size || collected.size == 1 || collected.size == 2) {
                    return message.reply("timeout, you need to be quicker with the response. If you wanted to cancel, you can send `cancel`.");
                }
            }
        });
    })
        .catch(err => {
            console.error(err);
            delete message.client.perms_setup[message.guild.id];
            message.reply("an error occurred, sorry for the inconvenience.");
        });
};

module.exports = {
    name: 'perms',
    aliases: ['permissions', 'perm'],
    cooldown: 11,
    description: 'Set up/Edit the permissions for each role and command (interactive setup)',
    execute
};