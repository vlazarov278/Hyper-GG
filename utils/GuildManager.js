const Guild = require('../models/Guild');
const { default_prefix } = require("./ConstantsManager");
const { default_streets } = require("./ConstantsManager");

const updateGuildCountMessage = async (client) => {
    return new Promise((resolve, reject) => {
        const guild_count = Array.from(client.guilds.cache.keys()).length;

        client.user.setActivity(`${guild_count} server${guild_count > 1 ? 's' : ''}. | ${ConstantsManager.default_prefix}help`, { type: 'WATCHING' })
            .then(presence => {
                console.log(`Activity set to ${presence.activities[0].name}`);
                resolve();
            })
            .catch(err => reject(err));
    });
};

/**
 * Get the prefix according to the guild_id
 * @param {String} guild_id 
 */
const getPrefix = async (guild_id) => {
    return new Promise((resolve, reject) => {
        Guild.findOne({
            where: {
                guild_id
            }
        }).then(guild => {
            if (!guild) return resolve(default_prefix);
            if (!guild.prefix) return resolve(default_prefix);
            return resolve(guild.prefix);
        }).catch(err => {
            reject(err);
        });
    });
};
/**
 * Set the prefix for a guild
 * @param {String} guild_id 
 * @param {String} prefix 
 */
const setPrefix = async (guild_id, prefix, guild_name = null) => {
    return new Promise((resolve, reject) => {
        Guild.findOne({
            where: {
                guild_id
            }
        }).then(guild => {
            if (!guild) {
                // No config, create the first entry

                Guild.create({
                    guild_id,
                    guild_name,
                    prefix
                }).then(g => {
                    resolve(g);
                }).catch(err => reject(err));
            } else {
                guild.prefix = prefix;
                guild.save()
                    .then(g => resolve(g))
                    .catch(err => reject(err));
            }
        }).catch(err => {
            reject(err);
        });
    });
};
/**
 * Pull custom street names or get default
 * @param {String} guild_id 
 */
const getStreetNames = async (guild_id) => {
    return new Promise((resolve, reject) => {
        Guild.findOne({
            where: {
                guild_id
            }
        }).then(guild => {
            if (!guild) return resolve(default_streets);
            if (!guild.streets_array_json) return resolve(default_streets);

            try {
                const custom_streets = JSON.parse(guild.streets_array_json);
                resolve(custom_streets);
            } catch (error) {
                var badParseException = new Error(error.message)
                badParseException.name = 'badParseException';
                reject(error);
            }
        }).catch(err => reject(err));
    });
}
/**
 * Set custom street names for a guild
 * @param {String} guild_id 
 * @param {Array} names 
 */
const setStreetNamesWithArray = async (guild_id, names) => {
    return new Promise((resolve, reject) => {
        Guild.findOne({
            where: {
                guild_id
            }
        }).then(guild => {
            if (!guild) {
                // No config, create the first entry
                Guild.create({
                    guild_id,
                    streets_array_json: JSON.stringify(names)
                }).then(g => {
                    resolve(g);
                }).catch(err => reject(err));
            } else {
                guild.streets_array_json = JSON.stringify(names);
                guild.save()
                    .then(g => resolve(g))
                    .catch(err => reject(err));
            }
        }).catch(err => reject(err));
    });
};

const resetStreetNames = async (guild_id) => {
    return new Promise((resolve, reject) => {
        Guild.findOne({
            where: {
                guild_id
            }
        }).then(guild => {
            if (guild) {
                guild.streets_array_json = null;
                guild.save()
                    .then(g => resolve(g))
                    .catch(err => reject(err));
            }
        }).catch(err => reject(err));
    });
};

module.exports = {
    getPrefix,
    setPrefix,
    getStreetNames,
    setStreetNamesWithArray,
    resetStreetNames,
    updateGuildCountMessage
}