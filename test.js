const GuildRoleManager = require("./utils/GuildRoleManager");

/*GuildRoleManager.addAllowedCommands("111", "111", ["ping"]).then(gr => {
    GuildRoleManager.addAllowedCommands("111", "222", ["fuck"]).then(gr => {
        GuildRoleManager.getAllowedCommands("111", "222").then(array => console.log(array))
    });
});*/

GuildRoleManager.removeAllowedCommands("111", "111", []).then(res => {
    GuildRoleManager.getAllowedCommands("111", "111").then(array => console.log(array))
})
.catch(err => console.error(err));