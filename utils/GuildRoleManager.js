const GuildRole = require('../models/GuildRole');
const ArrayManager = require('../utils/ArrayManager');
const { Op } = require('sequelize');

const getAllowedCommands = async (guild_id, role_id) => {
    return new Promise((resolve, reject) => {
        GuildRole.findOne({
            where: {
                guild_id,
                role_id
            }
        }).then(guildRole => {
            if (guildRole) {
                resolve(JSON.parse(guildRole.allowed_array_json));
            } else resolve([]);
        }).catch(err => reject(err));
    });
}

const getAllowedCommandsInRange = async (guild_id, role_ids) => {
    return new Promise((resolve, reject) => {
        GuildRole.findAll({
            where: {
                guild_id,
                role_id: {
                    [Op.in]: role_ids
                }
            }
        }).then(result => {
            if(!result) {
                resolve([]);
            }
            const allowed_array = [];
            for (let index = 0; index < result.length; index++) {
                const guildRole = result[index];
                const allowedCurrentRole = JSON.parse(guildRole.allowed_array_json);
                allowed_array.push(...allowedCurrentRole);
            }
            const new_allowed = ArrayManager.removeDuplicated(allowed_array);
            resolve(new_allowed);
        }).catch(err => reject(err));
    });
};

const addAllowedCommands = async (guild_id, role_id, allowed_array, role_name = null) => {
    const allowed_array_json = JSON.stringify(allowed_array);
    return new Promise((resolve, reject) => {
        GuildRole.findOne({
            where: {
                guild_id,
                role_id
            }
        }).then(guildRole => {
            if (!guildRole) {
                GuildRole.create({
                    guild_id,
                    role_id,
                    role_name,
                    allowed_array_json
                }).then(gr => {
                    resolve(gr);
                }).catch(err => reject(err));
            } else {
                const array = JSON.parse(guildRole.allowed_array_json);
                array.push(...allowed_array);
                const new_allowed = ArrayManager.removeDuplicated(array);
                guildRole.allowed_array_json = JSON.stringify(new_allowed);
                guildRole.save()
                    .then(gr => {
                        resolve(gr);
                    })
                    .catch(err => reject(err));
            }
        }).catch(err => reject(err));
    });
};

const removeAllowedCommands = async (guild_id, role_id, removeCommands) => {
    return new Promise((resolve, reject) => {
        GuildRole.findOne({
            where: {
                guild_id,
                role_id
            }
        }).then(guildRole => {
            if (!guildRole) {
                resolve();
            } else {
                const array = JSON.parse(guildRole.allowed_array_json);
                var new_allowed = [];
                removeCommands.forEach(cmd => {
                    new_allowed = [...(array.filter(e => !removeCommands.includes(e)))]
                });
                const finalArray = ArrayManager.removeDuplicated(new_allowed);
                guildRole.allowed_array_json = JSON.stringify(finalArray);
                guildRole.save()
                    .then(gr => resolve(gr))
                    .catch(err => reject(err));
            }
        }).catch(err => reject(err));
    });
};

module.exports = {
    addAllowedCommands,
    removeAllowedCommands,
    getAllowedCommands,
    getAllowedCommandsInRange
};