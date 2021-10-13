const fs = require("fs");
const ascii = require("ascii-table");
const chalk = require("chalk");

let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {

    let folders = fs.readdirSync("./commands/");
    folders.forEach((dir) => {
        const commandFiles = fs
            .readdirSync(`./commands/${dir}/`)
            .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
            }
            client.commands.set(command.name, command);
        }
    });

    console.log(table.toString());
    console.log(chalk.green(`Loaded Successfully [COMMAND]`));
}
