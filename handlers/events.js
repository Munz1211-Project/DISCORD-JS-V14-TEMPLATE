const fs = require("fs");
const ascii = require("ascii-table");
const chalk = require("chalk");

let table = new ascii("Events");
table.setHeading("Events", "Load status");

module.exports = (client) => {

    const eventFiles = fs
        .readdirSync(`./events/`)
        .filter((file) => file.endsWith(".js"));
    for (let file of eventFiles) {
        try {
            const Event = require(`../events/${file}`);
            if (Event.event && typeof Event.event !== "string") {
                table.addRow(file, `❌ -> Property event should be string.`);
                continue;
            }
            Event.event = Event.event || file.replace(".js", "")
            client.on(file.split(".")[0], (...args) => Event(client, ...args));
            table.addRow(file, '✅');
        } catch (err) {
            console.log("Error While loading")
            console.log(err)
            table.addRow(file, `❌ -> Error while loading event`);
        }
    }

    console.log(table.toString());
    console.log(chalk.green(`Loaded Successfully [EVENT]`));
}
