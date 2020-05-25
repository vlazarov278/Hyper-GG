const UserManager = require("./UserManager");

const backgroundCheck = async (message, args) => {
    return new Promise(async (resolve, reject) => {
        if (!args[0]) {
            var noBetException = new Error("You must place a bet.");
            noBetException.name = "NoBetException";
            return reject(noBetException);
        }

        if (isNaN(args[0])) {
            var notANumberError = new Error("Bet must be a number.");
            notANumberError.name = "NotANumberException";
            return reject(notANumberError);
        }

        var bet = parseFloat(args[0]);

        if (bet <= 19) {
            var tooLowBetException = new Error("Bet has to be higher than 19.");
            tooLowBetException.name = "TooLowBetException";
            return reject(tooLowBetException);
        }

        if (bet > 300) bet = 300;

        var canAfford = await UserManager.isAffordable(message.author.id, message.guild.id, bet);

        if (!canAfford) {
            var insufficientFundsException = new Error("You don't have enough credits.");
            insufficientFundsException.name = "insufficientFundsException";
            return reject(insufficientFundsException);
        }

        resolve(bet);
    });
}

const getStreetNames = async () => {
    return new Promise((resolve, reject) => {
        
    });
};

module.exports = {
    backgroundCheck
}