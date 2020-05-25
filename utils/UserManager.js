const User = require("../models/User");

const getUser = async (user_id, guild_id) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                user_id,
                guild_id
            }
        }).then(user => {
            resolve(user);
        }).catch(err => {
            console.error(err);
            reject(err);
        })
    });
};

const openAccount = async (user_id, guild_id, tag, balance = 100) => {
    return new Promise(async (resolve, reject) => {
        User.findOne({
            where: {
                user_id,
                guild_id
            }
        }).then(u => {
            // If the account exists, fail the operation
            if (u) {
                var accountExistsError = new Error("Account already exists")
                accountExistsError.name = "AccountExistsException";
                return reject(accountExistsError);
            }
            // Create the account
            User.create({
                user_id,
                guild_id,
                tag,
                balance
            }).then(u => {
                // Account has been created
                resolve(u);
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
};

const closeAccount = async (user_id, guild_id) => {
    return new Promise((resolve, reject) => {
        User.destroy({
            where: {
                user_id,
                guild_id
            },
        }).then(() => {
            resolve();
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

const addBalance = async (user_id, guild_id, toAdd) => {
    return new Promise((resolve, reject) => {
        // Check if the account exists in the database
        User.findOne({
            where: {
                user_id,
                guild_id
            }
        }).then(user => {
            if (!user) {
                // Account does not exist in the database.
                var noAccountError = new Error("No account found in the database.");
                noAccountError.name = "NoAccountException";
                return reject(noAccountError);
            } else {
                // Account has been found

                // Ensure/Handle toAdd being a number
                if (isNaN(toAdd)) {
                    var notANumberError = new Error("The value to add is not a number.");
                    notANumberError.name = "NotANumberException";
                    return reject(notANumberError)
                }

                // Add to the balance
                user.balance += toAdd;
                user.save()
                    .then(u => resolve(u))
                    .catch(err => {
                        console.error(err);
                        reject(err);
                    });
            }
        });
    });
};

const subtractBalance = (user_id, guild_id, toSubtract) => {
    return new Promise((resolve, reject) => {
        // Check if the account exists in the database
        User.findOne({
            where: {
                user_id,
                guild_id
            }
        }).then(user => {
            if (!user) {
                // Account does not exist in the database.
                var noAccountError = new Error("No account found in the database.");
                noAccountError.name = "NoAccountException";
                return reject(noAccountError);
            } else {
                // Account has been found

                // Ensure/Handle toSubtract being a number
                if (isNaN(toSubtract)) {
                    var notANumberError = new Error("The value to subtract is not a number.");
                    notANumberError.name = "NotANumberException";
                    return reject(notANumberError)
                }

                // Subtract from the balance
                user.balance -= toSubtract;
                // Make sure balance is not negative
                if (user.balance < 0) user.balance = 0;
                user.save()
                    .then(u => resolve(u))
                    .catch(err => {
                        console.error(err);
                        reject(err);
                    });
            }
        });
    });
};

const isAffordable = async (user_id, guild_id, toCheckValue) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                user_id,
                guild_id,
            }
        }).then(user => {
            if (!user) {
                // Account does not exist in the database.
                var noAccountError = new Error("No account found in the database.");
                noAccountError.name = "NoAccountException";
                return reject(noAccountError);
            }
            // Account has been found
            if (user.balance >= toCheckValue) resolve(true);
            else resolve(false);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
};

const getBalance = async (user_id, guild_id) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                user_id,
                guild_id
            }
        }).then(user => {
            if (!user) {
                // Account does not exist in the database.
                var noAccountError = new Error("No account found in the database.");
                noAccountError.name = "NoAccountException";
                return reject(noAccountError);
            }
            resolve(user.balance);
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    });
}

const bonusBoost = async (user_id, guild_id, bonus = 100, interval = 21600000) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                user_id,
                guild_id
            }
        }).then(user => {
            if (!user) {
                // Account does not exist in the database.
                var noAccountError = new Error("No account found in the database.");
                noAccountError.name = "NoAccountException";
                return reject(noAccountError);
            }

            // In case a bonus timestamp has yet to be set for that account
            if (user.bonus_timestamp) {

                // Ensure enough time has passed for a bonus to be given
                if ((user.bonus_timestamp.getTime() + interval) > Date.now()) {
                    var prematureError = new Error(user.bonus_timestamp.getTime());
                    prematureError.name = "PrematureBonusException";
                    return reject(prematureError);
                }
            }

            //Ensure bonus is a number
            if (isNaN(bonus)) {
                var notANumberError = new Error("The value to add as a bonus is not a number.");
                notANumberError.name = "NotANumberException";
                return reject(notANumberError)
            }

            user.balance += bonus;
            user.bonus_timestamp = new Date(Date.now());
            user.save()
                .then(u => {
                    resolve(u);
                })
                .catch(err => {
                    reject(err);
                });
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    });
};

module.exports = {
    openAccount,
    closeAccount,
    addBalance,
    subtractBalance,
    isAffordable,
    getBalance,
    getUser,
    bonusBoost
}