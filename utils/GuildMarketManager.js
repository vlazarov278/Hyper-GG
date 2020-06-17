const GuildMarket = require("../models/GuildMarket");

const setUpMarket = async (guild_id, isSellingRoles, isSellingAway, isSellingStatus, role_ids) => {
    return new Promise((resolve, reject) => {
        const roles_array_json = JSON.stringify(role_ids);
        GuildMarket.findOne({
            where: {
                guild_id
            }
        }).then(guildMarket => {
            if (!guildMarket) {
                guildMarket.create({
                    guild_id,
                    is_selling_roles: isSellingRoles,
                    is_selling_away: isSellingAway,
                    is_selling_status: isSellingStatus,
                    roles_array_json
                }).then(gMarket => {
                    resolve(gMarket);
                });
            } else {
                guildMarket.is_selling_roles = isSellingRoles;
                guildMarket.is_selling_away = isSellingAway;
                guildMarket.is_selling_status = isSellingStatus;
                guildMarket.roles_array_json = roles_array_json;
                guildMarket.save()
                    .then(gMarket => {
                        resolve(gMarket);
                    })
            }
        }).catch(err => reject(err));
    });
};

const hasMarket = async (guild_id) => {
    return new Promise((resolve, reject) => {
        GuildMarket.findOne({
            where: {
                guild_id
            }
        }).then(guildMarket => {
            if (guildMarket) return resolve(true);
            resolve(false);
        }).catch(err => reject(err));
    });
};

const getAvailableLists = async (guild_id) => {
    return new Promise((resolve, reject) => {
        GuildMarket.findOne({
            where: {
                guild_id
            }
        }).then(guildMarket => {
            if (!guildMarket) {
                var noGuildMarketException = new Error("There is no guild market setup on this guild.");
                noGuildMarketException.name = "noGuildMarketException";
                return reject(noGuildMarketException);
            }

            return resolve({
                isSellingRoles: guildMarket.is_selling_roles,
                isSellingAway: guildMarket.is_selling_away,
                isSellingStatus: guildMarket.is_selling_status
            });
        }).catch(err => reject(err));
    });
};

const getSellingRolesIds = async (guild_id) => {
    return new Promise((resolve, reject) => {
        GuildMarket.findOne({
            where: {
                guild_id
            }
        }).then(guildMarket => {
            if (!guildMarket) {
                var noGuildMarketException = new Error("There is no guild market setup on this guild.");
                noGuildMarketException.name = "noGuildMarketException";
                return reject(noGuildMarketException);
            }

            if (!guildMarket.is_selling_roles) {
                var isNotSellingRolesException = new Error("This guild has selling roles turned off.");
                isNotSellingRolesException.name = "isNotSellingRolesException";
                return reject(isNotSellingRolesException);
            }

            // In case no roles are offered for sale, return an empty array
            if (!guildMarket.roles_array_json) return resolve([]);

            const role_ids = JSON.parse(guildMarket.roles_array_json);
            return resolve(role_ids);
        }).catch(err => reject(err));
    });
};

module.exports = {
    hasMarket,
    guildHasMarket,
    getAvailableLists,
    getSellingRolesIds
}