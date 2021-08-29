const client = require("../index");
const config = require("../config.json");
const chalk = require("chalk");

module.exports.run = async (client) => {
    client.user.setPresence({
        status: "idle"
    });
    console.log(chalk.bgWhite.red(`✅ Successfully logged on as ${client.user.username}`));

    function randomstatus() {
        let status = [
            `${config.prefix}help | ?`,
            `${config.prefix}help | ??`,
            `${config.prefix}help | ???`,
            `${config.prefix}help | ????`
        ];
        let rstatus = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[rstatus], {
            type: "PLAYING"
        });
    }
    setInterval(randomstatus, 15000);

};