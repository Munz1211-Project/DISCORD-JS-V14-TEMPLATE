const fs = require("fs");

module.exports = (client) => {

    const eventFiles = fs.readdirSync(`./events/`).filter((file) => file.endsWith(".js"));

    for (let file of eventFiles) {
        try {
            const Event = require(`../events/${file}`);
            Event.event = Event.event || file.replace(".js", "")
            client.on(file.split(".")[0], (...args) => Event(client, ...args));
            client.logger.log(`> ➕ • Events on listener ${file} has been added.`, "event");
        } catch (err) {
            client.logger.log("Error While loading", "warn")
            client.logger.log(err, "error");
        }
    }
    client.logger.log(`> ✅ • Loaded Successfully [EVENT]`, "success");
};
