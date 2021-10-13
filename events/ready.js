const chalk = require("chalk");
const config = require("../config.json");

module.exports = async (client) => {

    client.user.setPresence({
        status: "idle"
    });

    function randomstatus() {
        let status = [
            `WATCHING | Members 👥`,
            `PLAYING | Server 🌐`,
            `LISTENING | ANYTHING`,
            `STREAMING | 24/7 ONLINE...!`
        ];
        let rstatus = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[rstatus], {
            type: "PLAYING"
        });
    };
    setInterval(randomstatus, 15000);

    console.log(chalk.bgBlack.greenBright(`✅ Successfully logged on as ${client.user.username}`));
}
