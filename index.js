require("dotenv").config();
const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Client();
const fs = require('fs');
const path = require('path');

const GuildManager = require('./utils/GuildManager');
const GuildRoleManager = require('./utils/GuildRoleManager');

const db = require("./config/database");
db.sync();

const cooldowns = new Discord.Collection();

const commandsPath = path.join(__dirname, 'Commands');
client.commands = new Discord.Collection();
// Keeps track wether guilds have an ongoing interactive setup for permissions (it works by having the guild_id as well as basic info on the executor)
client.perms_setup = {};

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`${commandsPath}/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  db.authenticate()
    .then(() => console.log("Connected to database..."))
    .catch((err) => console.error(err));
  console.log('Ready...');
  GuildManager.updateGuildCountMessage(client);
});

client.on('guildCreate', () => {
  GuildManager.updateGuildCountMessage(client);
});

client.on('guildDelete', () => {
  GuildManager.updateGuildCountMessage(client);
});

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== 'text') return message.reply('I can\'t execute commands inside DMs!');

  const prefix = await GuildManager.getPrefix(message.guild.id);

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 2) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      const reply = await message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.\n\`this message will disappear when you can try again\``);
      reply.delete({ timeout: expirationTime - now });
      return;
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    message.prefix = prefix;

    // Check if user has permission
    GuildRoleManager.getAllowedCommandsInRange(message.guild.id, Array.from(message.member.roles.cache.keys()))
      .then(res => {
        var isAllowed = false;
        if (res.includes(command.name)) isAllowed = true;
        if (command.aliases) {
          command.aliases.forEach(alias => {
            if (res.includes(alias)) isAllowed = true;
          })
        }
        if (isAllowed || message.member.hasPermission("ADMINISTRATOR")) return command.execute(message, args);
        message.delete();
        return message.author.send(`You do not have permission in this server to execute the command \`${command.name}\`. If you are managing the server, make sure to assign permissions correctly as by default all commands are disabled for non-admin members.`);
      });
  } catch (error) {
    console.error(error);
    // In case an error occurs in the perms command, this makes sure that the bot doesn't restrict the users from accessing it again
    delete message.client.perms_setup[message.guild.id];
    message.reply('there was an error trying to execute that command! Sorry for the inconvenience.');
  }
});

client.login(process.env.SECRET);

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));